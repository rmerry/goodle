package storage

import "github.com/mpgelliston/goodle/models"

type Storage interface {
	AddEvent(e *models.Event) error
	AddUser(u *models.User) error
	GetEventByHash(h string) (*models.Event, error)
}

func NewLocalStorage() (Storage, error) {
	l := &LocalStorage{}
	err := l.initialise()
	return l, err
}

func NewS3Storage() (Storage, error) {
	return &S3Storage{}, nil
}
