package repository

import "time"

// Status represents the runtime (non-persisted) status of a repository.
type Status struct {
	ID        string    `json:"id"`
	Online    bool      `json:"online"`
	Error     string    `json:"error,omitempty"`
	CheckedAt time.Time `json:"checkedAt"`
}
