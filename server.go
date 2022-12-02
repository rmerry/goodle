package main

import (
	"fmt"
	"net/http"
	"time"
)

func (app *application) serve() error {
	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", app.config.port),
		Handler:      app.routes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
		// Create a new Go log.Logger passing our custom logger as the first param.
		// The "" means no prefix and 0 means not use any prefix or flags.
		//ErrorLog: log.New(app.logger, "", 0),
	}

	fmt.Printf("starting server: %s\n", srv.Addr)
	err := srv.ListenAndServe()
	if err != nil {
		return err
	}
	return nil
}
