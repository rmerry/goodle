package main

import (
	"log"
	"net/http"
)

// Generic helper for sending an error response back to the client with a custom status code.
func (app *application) errorResponse(w http.ResponseWriter, r *http.Request, status int, message interface{}) {
	env := envelope{"error": message}

	// Send the error back with the writeJSON,
	// IF that errors fall back to sending an empty response to client
	err := app.writeJSON(w, status, env, nil)
	if err != nil {
		log.Println(err)
	}
}

// 400 Sends a 400 Bad Request response
func (app *application) badRequestResponse(w http.ResponseWriter, r *http.Request, err error) {
	log.Println(err)
	app.errorResponse(w, r, http.StatusBadRequest, err.Error())
}

// 404 Sends a Not Found status response (404)
func (app *application) notFoundResponse(w http.ResponseWriter, r *http.Request) {
	message := "the requested resource could not be found"
	app.errorResponse(w, r, http.StatusNotFound, message)
}

// 500 Sends an internal server error response (500)
func (app *application) serverErrorResponse(w http.ResponseWriter, r *http.Request, err error) {
	log.Println(err)
	message := "The server encountered a problem and was unable to process your request"
	app.errorResponse(w, r, http.StatusInternalServerError, message)
}
