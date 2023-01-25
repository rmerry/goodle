package main

import "net/http"

func (app *application) healthCheckHandler(w http.ResponseWriter, r *http.Request) {
	err := app.writeJSON(w, http.StatusCreated, envelope{"status": "online"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
	return
}
