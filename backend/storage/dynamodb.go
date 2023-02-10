package storage

import (
	"context"
	"fmt"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/mpgelliston/goodle/models"
)

type DynamoDBStorageOptions struct {
	Region         string
	AccessKey      string
	SecretKey      string
	EventTableName string
}

// Type DynamoDBStorage implements the Storage interace.
type DynamoDBStorage struct {
	client *dynamodb.Client
	opts   *DynamoDBStorageOptions
}

func NewDynamoDBStorage(opts *DynamoDBStorageOptions) (*DynamoDBStorage, error) {
	cfg, err := config.LoadDefaultConfig(context.TODO(), func(o *config.LoadOptions) error {
		o.Region = opts.Region
		o.Credentials = aws.NewCredentialsCache(credentials.NewStaticCredentialsProvider(opts.AccessKey, opts.SecretKey, ""))

		return nil
	})
	if err != nil {
		return nil, err
	}

	c := dynamodb.NewFromConfig(cfg)
	return &DynamoDBStorage{
		client: c,
		opts:   opts,
	}, nil
}

func (s *DynamoDBStorage) AddEvent(e *models.Event) error {
	dynamoEvent, _ := attributevalue.MarshalMap(e)
	_, err := s.client.PutItem(context.TODO(), &dynamodb.PutItemInput{
		TableName: aws.String(s.opts.EventTableName),
		Item:      dynamoEvent,
	})

	return err
}

func (s *DynamoDBStorage) AddUser(u *models.User) error {
	panic("not implemented")
}

func (s *DynamoDBStorage) GetEventByHash(h string) (*models.Event, error) {
	out, err := s.client.GetItem(context.TODO(), &dynamodb.GetItemInput{
		TableName: aws.String(s.opts.EventTableName),
		Key: map[string]types.AttributeValue{
			"PublicHash": &types.AttributeValueMemberS{Value: h},
		},
	})
	if err != nil {
		return nil, err
	}

	var event *models.Event
	if err = attributevalue.UnmarshalMap(out.Item, &event); err != nil {
		return nil, fmt.Errorf("failed to unmarshal event, %v", err)
	}

	return event, nil
}
