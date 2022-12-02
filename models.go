package main

import (
	"math/rand"
	"time"
)

const EVENT_HASH_LENGTH = 10

type User struct {
	Name  string
	Email string
}

type EventDate struct {
	Attendees []User
}

type Event struct {
	Hash        string
	Title       string
	Description string
	Dates       map[time.Time]EventDate
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
