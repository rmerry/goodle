package storage

import (
	"encoding/gob"
	"fmt"
	"io"
	"os"

	"github.com/mpgelliston/goodle/models"
)

// Filenames for the storage of data
const FILE_USERS string = "users.gob"
const FILE_EVENTS string = "events.gob"

type LocalStorage struct {
	events map[string]*models.Event
	users  map[string]*models.User
}

func (l *LocalStorage) AddEvent(e *models.Event) error {
	l.events[e.PublicHash] = e
	err := commit(l.events, FILE_EVENTS)
	if err != nil {
		return fmt.Errorf("unable to add event - %s", err.Error())
	}

	return nil
}

func (l *LocalStorage) AddUser(u *models.User) error {
	l.users[u.Email] = u
	err := commit(l.users, FILE_USERS)
	if err != nil {
		return fmt.Errorf("unable to add user - %s", err.Error())
	}

	return nil
}

func (l *LocalStorage) GetEventByHash(h string) (*models.Event, error) {
	e, _ := l.events[h]
	return e, nil
}

// Stores the system data to file
func commit(data interface{}, filename string) error {
	gob.Register(map[string]*models.Event{})
	file, err := os.OpenFile(filename, os.O_RDWR|os.O_CREATE, 0666)
	if err != nil {
		return err
	}
	defer file.Close()

	encoder := gob.NewEncoder(file)
	err = encoder.Encode(data)
	if err != nil {
		return err
	}

	return nil
}

// init must be the first function called.
func (l *LocalStorage) initialise() error {
	gob.Register(map[string]*models.Event{})
	gob.Register(map[string]*models.User{})

	l.events = make(map[string]*models.Event)
	l.users = make(map[string]*models.User)

	file, err := os.OpenFile(FILE_EVENTS, os.O_RDWR|os.O_CREATE, 0666)
	if err != nil {
		return err
	}
	defer file.Close()

	decoder := gob.NewDecoder(file)
	m := make(map[string]*models.Event)
	err = decoder.Decode(&m)
	if err != nil && err != io.EOF {
		return err
	}

	l.events = m // Added this so that events are in the app and can be retrieved when initialised

	file, err = os.OpenFile(FILE_USERS, os.O_RDWR|os.O_CREATE, 0666)
	if err != nil {
		return err
	}

	defer file.Close()

	decoder = gob.NewDecoder(file)
	err = decoder.Decode(&l.users)
	if err != nil && err != io.EOF {
		return err
	}

	return nil
}
