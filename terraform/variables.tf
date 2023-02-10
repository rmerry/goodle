variable "region" {
  type = string
  description = "AWS region"
  default = "eu-west-1"
}

variable "environment" {
  type = string
  description = "Logical Deployment Environment"
  default = "eu-west-1"
}

variable "name" {
  type = string
  description = "The name of the project"
  default = "project-x"
}
