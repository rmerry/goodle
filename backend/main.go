package main

import (
	"flag"
	"log"
)

type config struct {
	port int
	cors struct {
		trustedOrigins []string
	}
}

type application struct {
	config       config
	EventsByHash map[string]*Event
	UsersByEmail map[string]*User
}

func main() {
	var cfg config
	// TODO Add the cors domains as parameters when booting up the instance
	cfg.cors.trustedOrigins = []string{"http://localhost:3000", "http://goodle.codestar.com.s3-website-eu-west-1.amazonaws.com", "http://goodle.codestar.com", "https://goodle.codestar.com"}

	flag.IntVar(&cfg.port, "port", 4001, "API server port to listen on")

	app := &application{
		config:       cfg,
		EventsByHash: make(map[string]*Event),
		UsersByEmail: make(map[string]*User),
	}

	err := app.loadData()
	if err != nil {
		log.Fatal(err)
	}

	err = app.serve()
	if err != nil {
		log.Fatal(err)
	}
}
