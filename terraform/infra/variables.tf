variable "environment" {
  type = string
  description = "value for the environment name (e.g. dev, staging, prod)"
  validation {
    condition = can(regex("^[a-z0-9-]+$", var.environment))
    error_message = "Environment name must be lowercase alphanumeric characters and dashes only"
  }
}

variable "max_size" {
  description = "value for the max size of the autoscaling group, if is_prduction is false, this value will be ignored"
  type = number
}

variable "min_size" {
  description = "value for the min size of the autoscaling group,if is_prduction is false, this value will be ignored"
  type = number
}

variable "is_prduction" {
  type = bool
}

variable "aplication-name" {
  type = string
    description = "value for the application name"
}

variable "region_aws" {
  type = string
}

variable "repository_name" {
  type = string
}


variable "aplication_port" {
    type = number
}


variable "instance_type_aws" {
  type = string
}

variable "instance_ami_aws" {
  type = string
}
variable "ssh_key_public" {
  type = string
}


variable "AWS_REGION" {
  type = string
}

variable "AWS_USER_ID" {
  type = string
}

variable "AWS_ACCESS_KEY_ID" {
  type = string
}

variable "AWS_SECRET_ACCESS_KEY" {
  type = string
}
