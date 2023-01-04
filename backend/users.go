package main

import "net/http"

func (app *application) createUserHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Name  string `json:"name"`
		Email string `json:"email"`
	}

	err := app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	user := &User{
		Name:  input.Name,
		Email: input.Email,
	}

	app.UsersByEmail[user.Email] = user

	err = app.saveData(app.UsersByEmail, FILE_USERS)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusCreated, envelope{"user": user}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}
