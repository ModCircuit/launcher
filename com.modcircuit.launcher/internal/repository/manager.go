package repository

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"os"
	"sync"
	"time"

	"com.modcircuit.launcher/internal/fs"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// Manager is the authoritative repository orchestrator.
type Manager struct {
	ctx      context.Context
	repos    map[string]Repository
	status   map[string]Status
	mu       sync.RWMutex
	pingStop chan struct{}
}

// NewManager creates a repository manager and loads persisted repositories.
func NewManager(ctx context.Context) (*Manager, error) {
	m := &Manager{
		ctx:    ctx,
		repos:  make(map[string]Repository),
		status: make(map[string]Status),
	}

	if err := m.loadFromFile(); err != nil {
		return nil, err
	}

	return m, nil
}

// StartBackgroundPing starts a goroutine that calls PingAll every interval.
func (m *Manager) StartBackgroundPing(interval time.Duration) {
	if interval <= 0 {
		interval = 5 * time.Minute
	}
	m.pingStop = make(chan struct{})
	go func() {
		ticker := time.NewTicker(interval)
		defer ticker.Stop()
		for {
			select {
			case <-ticker.C:
				m.PingAll()
			case <-m.pingStop:
				return
			}
		}
	}()
}

// StopBackgroundPing stops the background ping goroutine.
func (m *Manager) StopBackgroundPing() {
	if m.pingStop != nil {
		close(m.pingStop)
		m.pingStop = nil
	}
}

// RestartBackgroundPing stops any running ping loop and starts a new one.
func (m *Manager) RestartBackgroundPing(interval time.Duration) {
	m.StopBackgroundPing()
	m.StartBackgroundPing(interval)
}

// -----------------------------------------------------------------------------
// Persistence
// -----------------------------------------------------------------------------

func (m *Manager) loadFromFile() error {
	paths, err := fs.EnsurePaths()
	if err != nil {
		return err
	}

	data, err := os.ReadFile(paths.RepositoriesPath())
	if err != nil {
		if os.IsNotExist(err) {
			return nil
		}
		return err
	}

	var list []Repository
	if err := json.Unmarshal(data, &list); err != nil {
		return err
	}

	m.mu.Lock()
	defer m.mu.Unlock()

	for _, r := range list {
		m.repos[r.ID] = r
	}

	return nil
}

// saveToFileLocked writes repos to disk. Caller must hold m.mu (read or write).
func (m *Manager) saveToFileLocked() error {
	paths, err := fs.EnsurePaths()
	if err != nil {
		return err
	}

	list := make([]Repository, 0, len(m.repos))
	for _, r := range m.repos {
		list = append(list, r)
	}

	data, err := json.MarshalIndent(list, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(paths.RepositoriesPath(), data, 0o644)
}

// -----------------------------------------------------------------------------
// Repository CRUD
// -----------------------------------------------------------------------------

func (m *Manager) List() []Repository {
	m.mu.RLock()
	defer m.mu.RUnlock()

	out := make([]Repository, 0, len(m.repos))
	for _, r := range m.repos {
		out = append(out, r)
	}
	return out
}

func (m *Manager) Get(id string) (Repository, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	r, ok := m.repos[id]
	if !ok {
		return Repository{}, errors.New("repository not found")
	}
	return r, nil
}

func (m *Manager) Add(repo Repository) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if _, exists := m.repos[repo.ID]; exists {
		return errors.New("repository already exists")
	}

	m.repos[repo.ID] = repo
	return m.saveToFileLocked()
}

func (m *Manager) Update(repo Repository) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if _, exists := m.repos[repo.ID]; !exists {
		return errors.New("repository not found")
	}

	m.repos[repo.ID] = repo
	return m.saveToFileLocked()
}

func (m *Manager) Remove(id string) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if _, exists := m.repos[id]; !exists {
		return errors.New("repository not found")
	}

	delete(m.repos, id)
	delete(m.status, id)
	return m.saveToFileLocked()
}

// -----------------------------------------------------------------------------
// Status handling
// -----------------------------------------------------------------------------

func (m *Manager) GetStatus(id string) (Status, bool) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	s, ok := m.status[id]
	return s, ok
}

func (m *Manager) PingAll() {
	m.mu.RLock()
	defer m.mu.RUnlock()

	for _, repo := range m.repos {
		if !repo.Enabled {
			continue
		}
		go m.pingOne(repo)
	}
}

// Ping pings a single repository by ID. Disabled repositories are skipped.
func (m *Manager) Ping(id string) {
	m.mu.RLock()
	repo, ok := m.repos[id]
	m.mu.RUnlock()

	if ok && repo.Enabled {
		go m.pingOne(repo)
	}
}

func (m *Manager) pingOne(repo Repository) {
	client := http.Client{Timeout: 3 * time.Second}

	api, err := repo.APIBaseURL()
	status := Status{
		ID:        repo.ID,
		CheckedAt: time.Now(),
	}

	if err != nil {
		status.Online = false
		status.Error = err.Error()
	} else {
		resp, err := client.Get(api + "/health")
		if err != nil || resp.StatusCode >= 400 {
			status.Online = false
			status.Error = "unreachable"
		} else {
			status.Online = true
		}
		if resp != nil {
			_ = resp.Body.Close()
		}
	}

	m.mu.Lock()
	m.status[repo.ID] = status
	m.mu.Unlock()

	runtime.EventsEmit(m.ctx, "repository:status", status)
}