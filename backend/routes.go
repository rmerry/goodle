package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func (app *application) routes() http.Handler {
	router := httprouter.New()

	// Events
	router.HandlerFunc(http.MethodPost, "/v1/event", app.createEventHandler)
	router.HandlerFunc(http.MethodPost, "/v1/event/:hash/attendee", app.createAttendeeHandler)
	router.HandlerFunc(http.MethodDelete, "/v1/event/:hash/attendee", app.deleteAttendeeHandler)
	router.HandlerFunc(http.MethodGet, "/v1/event/:hash", app.getEventHandler)

	// Users
	router.HandlerFunc(http.MethodPost, "/v1/user", app.createUserHandler)

	// Apply the middleware
	return app.enableCORS(router)
}
