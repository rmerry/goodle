package main

import (
	"flag"
	"log"

	"github.com/mpgelliston/goodle/storage"
)

type config struct {
	port int
	cors struct {
		trustedOrigins []string
	}
}

type application struct {
	config  config
	storage storage.Storage
}

func main() {
	var cfg config
	cfg.cors.trustedOrigins = []string{"http://localhost:3000"}

	flag.IntVar(&cfg.port, "port", 4001, "API server port to listen on")
	// flag.StringVar(&cfg., "port", 4001, "API server port to listen on")

	var s storage.Storage
	s, err := storage.NewLocalStorage()
	if err != nil {
		panic(err)
	}

	app := &application{
		config:  cfg,
		storage: s,
	}

	err = app.serve()
	if err != nil {
		log.Fatal(err)
	}
}
