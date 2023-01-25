package models

import (
	"math/rand"
	"time"
)

const EVENT_HASH_LENGTH = 10

type Email string
type User struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}

type EventDate struct {
	Attendees []User `json:"attendees"`
}

type Event struct {
	Hash        string                  `json:"hash"`
	Title       string                  `json:"title"`
	Description string                  `json:"description"`
	Dates       map[time.Time]EventDate `json:"dates"`
}

func NewEvent() *Event {
	var letterRunes = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")
	hash := make([]rune, EVENT_HASH_LENGTH)
	for i := range hash {
		hash[i] = letterRunes[rand.Intn(len(letterRunes))]
	}
	return &Event{
		Hash: string(hash),
	}
}
