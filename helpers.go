package main

import (
	"encoding/gob"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"

	"github.com/julienschmidt/httprouter"
)

// An envelope type to send back the JSON responses
type envelope map[string]interface{}

// Filenames for the storage of data
const FILE_USERS string = "users.gob"
const FILE_EVENTS string = "events.gob"

func (app *application) readJSON(w http.ResponseWriter, r *http.Request, dst interface{}) error {
	// Set the max request size to be 1MB
	maxBytes := 1_048_576
	r.Body = http.MaxBytesReader(w, r.Body, int64(maxBytes))

	// Init a new decoder and call the DisallowUnknownFields() method on it before decoding.
	// Any extra field found will cause an error instead of just ignoring it.
	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()

	// Perform the decode
	err := dec.Decode(dst)

	if err != nil {
		var syntaxError *json.SyntaxError
		var unmarshalTypeError *json.UnmarshalTypeError
		var invalidUnmarshalError *json.InvalidUnmarshalError

		switch {
		// errors.As checks for the first error in the chain
		// Use this to check first to see if there is a syntax error in JSON
		case errors.As(err, &syntaxError):
			return fmt.Errorf("body contains badly formed JSON (at character %d", syntaxError.Offset)
			// errors.Is checks if the errors exists anywhere in the chain
			// Use this to see if there is an issue with how the JSON is formed.
		case errors.Is(err, io.ErrUnexpectedEOF):
			return errors.New("body contains badly formed JSON")
			// Check to see if  there is a type mismatch in the JSON. If we can trace the field then do so.
		case errors.As(err, &unmarshalTypeError):
			if unmarshalTypeError.Field != "" {
				return fmt.Errorf("body contains incorrect JSON type for field %q", unmarshalTypeError.Field)
			}
			return fmt.Errorf("body contains incorrect JSON type (at character %d", unmarshalTypeError.Offset)
			// If there is an empty request then return this error
		case errors.Is(err, io.EOF):
			return errors.New("body must not be empty")

			// If the JSON has a field that is not mappale then throw this message.
			// This could become a proper error type at a later date as per https://github.com/golang/go/issues/29035
		case strings.HasPrefix(err.Error(), "json: unknown field"):
			fieldName := strings.TrimPrefix(err.Error(), "json: unknown field")
			return fmt.Errorf("body contains unknown key %q", fieldName)

			// If the request is larger than the 1MB limit
			// This also could become its own error type in the future https://github.com/golang/go/issues/30715
		case err.Error() == "http: request body too large":
			return fmt.Errorf("body must not be larger than %d bytes", maxBytes)

			// This error happens if we pass in a non nil pointer to Decode(). We catch this and panic rather than returning the error
		case errors.As(err, &invalidUnmarshalError):
			panic(err)

		default:
			return err
		}
	}

	// Now we call decode again with an anonymous struct as the destination.
	// If the request only had a single JSON value in it then we will io.EOF error.
	// Which is good means nothing else, however if no error then there must have been more than one JSON value
	err = dec.Decode(&struct{}{})
	if err != io.EOF {
		return errors.New("body must only contain a single JSON value")
	}

	return nil
}

// writeJSON helper for sending JSON response back.
func (app *application) writeJSON(w http.ResponseWriter, status int, data envelope, headers http.Header) error {
	// Encode the json data, returning an error if there is one
	js, err := json.MarshalIndent(data, "", "\t")
	if err != nil {
		return err
	}

	// Add a newline to make it look nicer in terminal apps
	js = append(js, '\n')

	// Append the headers to the output header map
	for key, value := range headers {
		w.Header()[key] = value
	}

	// Set the content type and the status code
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write(js)

	return nil
}

// Retrieve the "hash" parameter from the current request context conver to int and returnut.
// If unsuccessful returns 0 and an error.
func (app *application) readHashParam(r *http.Request) (string, error) {
	params := httprouter.ParamsFromContext(r.Context())

	hash := params.ByName("hash")
	if hash == "" {
		return "", errors.New("invalid hash parameter")
	}

	return hash, nil
}

// Stores the system data to file
func (app *application) saveData(data interface{}, filename string) error {
	file, err := os.Create(filename)
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

func (app *application) loadData() error {
	file, err := os.Open(FILE_EVENTS)
	if err != nil {
		return err
	}

	defer file.Close()

	decoder := gob.NewDecoder(file)
	err = decoder.Decode(&app.EventsByHash)
	if err != nil {
		return err
	}

	file, err = os.Open(FILE_USERS)
	if err != nil {
		return err
	}

	defer file.Close()

	decoder = gob.NewDecoder(file)
	err = decoder.Decode(&app.UsersByEmail)
	if err != nil {
		return err
	}

	return nil
}
