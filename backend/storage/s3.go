package storage

import "github.com/mpgelliston/goodle/models"

// Type S3Storage implements the Storage interace.
type S3Storage struct {
}

func (s *S3Storage) AddEvent(e *models.Event) error {
	panic("not implemented")
}

func (s *S3Storage) AddUser(u *models.User) error {
	panic("not implemented")
}

func (s *S3Storage) GetEventByHash(h string) (*models.Event, error) {
	panic("not implemented")
}
