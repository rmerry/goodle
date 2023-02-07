package main

import (
	"net/http"
	"time"

	"github.com/mpgelliston/goodle/models"
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

	event := models.NewEvent()
	event.Title = input.Title
	event.Description = input.Description
	event.Dates = make(map[time.Time]models.EventDate)

	if err = app.storage.AddEvent(event); err != nil {
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
	if len(hash) < models.EVENT_HASH_LENGTH {
		app.notFoundResponse(w, r)
		return
	}

	// Remove control characters etc as these are lost on the storing in file.
	hash = hash[0:models.EVENT_HASH_LENGTH]
	event, err := app.storage.GetEventByHash(hash)
	if err != nil { // 500 Bad Response
		app.serverErrorResponse(w, r, err)
	} else if event == nil { // 404 Not Found
		app.notFoundResponse(w, r)
	}
	err = app.writeJSON(w, http.StatusOK, envelope{"event": event}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
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
		Hash  string    `json:"hash"`
	}

	err = app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	user := models.User{
		Name:  input.Name,
		Email: input.Email,
	}

	event, err := app.storage.GetEventByHash(hash)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	} else if event == nil {
		// New date added so lets start with this
		event.Dates[input.Date] = models.EventDate{
			Attendees: []models.User{user},
		}
	} else {
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
			event.Dates[input.Date] = models.EventDate{
				Attendees: []models.User{user},
			}
		}
	}

	// Store the event and then send back a nice response
	if err = app.storage.AddEvent(event); err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusCreated, envelope{"event": event}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
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

	event, err := app.storage.GetEventByHash(hash)
	if err != nil {
		// Check to see if the event date already exists if not add
		if eventDate, ok := event.Dates[input.Date]; ok {

			// Find the users attendence
			for i, u := range eventDate.Attendees {
				if input.Email == u.Email {
					eventDate.Attendees = append(eventDate.Attendees[:i], eventDate.Attendees[i+1:]...)
					event.Dates[input.Date] = eventDate
					if err := app.storage.AddEvent(event); err != nil {
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
