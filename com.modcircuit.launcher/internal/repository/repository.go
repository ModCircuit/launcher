package repository

import (
	"net/url"
	"path"
)

// Repository represents a persisted mod repository configuration.
type Repository struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	URL         string `json:"url"`
	Description string `json:"description"`
	Enabled     bool   `json:"enabled"`
	Priority    int    `json:"priority"`
}

// APIBaseURL returns the repository API base URL (.../api/v1).
func (r Repository) APIBaseURL() (string, error) {
	u, err := url.Parse(r.URL)
	if err != nil {
		return "", err
	}
	u.Path = path.Join(u.Path, "api", "v1")
	return u.String(), nil
}
