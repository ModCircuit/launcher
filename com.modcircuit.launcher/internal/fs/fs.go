package fs

import (
	"os"
	"path/filepath"
)

type Paths struct {
	appRoot              string
	instancesPath        string
	SettingsFilePath     string
	RepositoriesFilePath string
}

// EnsurePaths initializes the app directory, settings file, repositories file, and instances directory
func EnsurePaths() (*Paths, error) {
	// Get user home directory
	base, err := os.UserConfigDir()
	if err != nil {
		return nil, err
	}

	// App root
	appRoot := filepath.Join(base, ".ModCircuitLauncher")
	if err := os.MkdirAll(appRoot, 0o755); err != nil {
		return nil, err
	}

	// Settings file
	settingsPath := filepath.Join(appRoot, "settings.json")
	if info, err := os.Stat(settingsPath); err != nil {
		if os.IsNotExist(err) {
			f, err := os.OpenFile(settingsPath, os.O_CREATE|os.O_WRONLY, 0o644)
			if err != nil {
				return nil, err
			}
			_, _ = f.Write([]byte("{}"))
			_ = f.Close()
		} else {
			return nil, err
		}
	} else if info.IsDir() {
		return nil, os.ErrInvalid
	}

	// Repositories file
	repositoriesPath := filepath.Join(appRoot, "repositories.json")
	if info, err := os.Stat(repositoriesPath); err != nil {
		if os.IsNotExist(err) {
			f, err := os.OpenFile(repositoriesPath, os.O_CREATE|os.O_WRONLY, 0o644)
			if err != nil {
				return nil, err
			}
			_, _ = f.Write([]byte("[]"))
			_ = f.Close()
		} else {
			return nil, err
		}
	} else if info.IsDir() {
		return nil, os.ErrInvalid
	}

	// Instances directory
	instancesPath := filepath.Join(appRoot, "instances")
	if err := os.MkdirAll(instancesPath, 0o755); err != nil {
		return nil, err
	}

	return &Paths{
		appRoot:              appRoot,
		instancesPath:        instancesPath,
		SettingsFilePath:     settingsPath,
		RepositoriesFilePath: repositoriesPath,
	}, nil
}

// Returns app root path
func (p *Paths) AppRoot() string {
	return p.appRoot
}

// Returns settings file path
func (p *Paths) SettingsPath() string {
	return p.SettingsFilePath
}

// Returns instances directory path
func (p *Paths) InstancesPath() string {
	return p.instancesPath
}

// Returns repositories file path
func (p *Paths) RepositoriesPath() string {
	return p.RepositoriesFilePath
}
