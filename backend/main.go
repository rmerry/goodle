package main

import (
	"flag"
	"fmt"
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
	awsAccessKey := flag.String("aws-access-key", "", "The AWS access key. Not required when using local storage.")
	awsRegion := flag.String("aws-region", "", "The AWS region in which the DynamoDB instance is hosted. Not required when using local storage.")
	awsSecretKey := flag.String("aws-secret-key", "", "The AWS secret key. Not required when using local storage.")
	dynamoDBTableName := flag.String("dynamodb-table-name", "", "The DynamoDB table name. Not required when using local storage.")
	localStorage := flag.Bool("local-storage", true, "Use local storage instead of DynamoDB; intended for testing purposes only.")
	port := flag.Int("port", 4001, "API server port to listen on")
	flag.Parse()

	fmt.Println(*awsRegion)

	var (
		cfg config
		err error
		s   storage.Storage
	)
	if *localStorage {
		s, err = storage.NewLocalStorage()
	} else {
		s, err = storage.NewDynamoDBStorage(&storage.DynamoDBStorageOptions{
			Region:         *awsRegion,
			AccessKey:      *awsAccessKey,
			SecretKey:      *awsSecretKey,
			EventTableName: *dynamoDBTableName,
		})
	}
	if err != nil {
		panic(err)
	}

	cfg.cors.trustedOrigins = []string{"http://localhost:3000", "http://goodle.codestar.com.s3-website-eu-west-1.amazonaws.com", "http://goodle.codestar.com", "https://goodle.codestar.com"} // TODO Add the cors domains as parameters when booting up the instance
	cfg.port = *port

	app := &application{
		config:  cfg,
		storage: s,
	}

	err = app.serve()
	if err != nil {
		log.Fatal(err)
	}
}
