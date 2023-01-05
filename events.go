package main

import (
	"net/http"
	"time"
)

func (app *application) createEventHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Title       string `json:"title"`
		Description string `json:"description"`
	}

	err := app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	event := NewEvent()
	event.Title = input.Title
	event.Description = input.Description
	event.Dates = make(map[time.Time]EventDate)

	app.EventsByHash[event.Hash] = event
	err = app.saveData(app.EventsByHash, FILE_EVENTS)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusCreated, envelope{"event": event}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

// Get Event Handler - Returns an event based on the hash passed through or 404
func (app *application) getEventHandler(w http.ResponseWriter, r *http.Request) {
	hash, err := app.readHashParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	if len(hash) < EVENT_HASH_LENGTH {
		app.notFoundResponse(w, r)
		return
	}

	// Remove control characters etc as these are lost on the storing in file.
	hash = hash[0:EVENT_HASH_LENGTH]
	if event, ok := app.EventsByHash[hash]; ok {
		err = app.writeJSON(w, http.StatusCreated, envelope{"event": event}, nil)
		if err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}
		return
	}

	// 404 Not Found
	app.notFoundResponse(w, r)
}

func (app *application) createAttendeeHandler(w http.ResponseWriter, r *http.Request) {
	hash, err := app.readHashParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}
	var input struct {
		Email string    `json:"email"`
		Name  string    `json:"name"`
		Date  time.Time `json:"date"`
	}

	err = app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	user := User{
		Name:  input.Name,
		Email: input.Email,
	}

	if event, ok := app.EventsByHash[hash]; ok {
		// Check to see if the event date already exists if not add
		if eventDate, ok := event.Dates[input.Date]; ok {
			// Check to see if the user is already in
			found := false
			for _, u := range eventDate.Attendees {
				if user.Email == u.Email {
					found = true
				}
			}

			if !found {
				eventDate.Attendees = append(eventDate.Attendees, user)
				event.Dates[input.Date] = eventDate
			}
		} else {
			// New date added so lets start with this
			event.Dates[input.Date] = EventDate{
				Attendees: []User{user},
			}
		}

		// Store the event and then send back a nice response
		app.EventsByHash[hash] = event
		err = app.saveData(app.EventsByHash, FILE_EVENTS)
		if err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}

		err = app.writeJSON(w, http.StatusCreated, envelope{"event": event}, nil)
		if err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}
		return
	}

	// 404 Not found
	app.notFoundResponse(w, r)
}

// Remove a User from attendence
func (app *application) deleteAttendeeHandler(w http.ResponseWriter, r *http.Request) {
	hash, err := app.readHashParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}
	var input struct {
		Email string    `json:"email"`
		Date  time.Time `json:"date"`
	}

	err = app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if event, ok := app.EventsByHash[hash]; ok {
		// Check to see if the event date already exists if not add
		if eventDate, ok := event.Dates[input.Date]; ok {

			// Find the users attendence
			for i, u := range eventDate.Attendees {
				if input.Email == u.Email {
					eventDate.Attendees = append(eventDate.Attendees[:i], eventDate.Attendees[i+1:]...)
					event.Dates[input.Date] = eventDate
					app.EventsByHash[hash] = event

					err = app.saveData(app.EventsByHash, FILE_EVENTS)
					if err != nil {
						app.serverErrorResponse(w, r, err)
						return
					}

					err = app.writeJSON(w, http.StatusCreated, envelope{"event": event}, nil)
					if err != nil {
						app.serverErrorResponse(w, r, err)
						return
					}
					return
				}
			}
		}
	}

	// 404 Not found
	app.notFoundResponse(w, r)
}
