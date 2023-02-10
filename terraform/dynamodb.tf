resource "aws_dynamodb_table" "dynamodb_events_table" {
  name             = "${var.environment}-${var.name}-events"
  billing_mode     = "PROVISIONED"
  read_capacity    = 1
  write_capacity   = 1
  hash_key         = "PublicHash"

  attribute {
    name = "PublicHash"
    type = "S"
  }
 
  attribute {
    name = "PrivateHash"
    type = "S"
  }

  global_secondary_index {
    name               = "PrivateHashIndex"
    hash_key           = "PrivateHash"
    write_capacity     = 10
    read_capacity      = 10
    projection_type    = "ALL"
  }

  tags = {
    Name        = "${var.name}"
    Environment = "${var.environment}"
  }
}
