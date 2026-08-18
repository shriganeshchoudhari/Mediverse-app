terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  # For local execution purposes, we are using local state. 
  # In a real environment, an S3 backend with DynamoDB locking would be used.
}

provider "aws" {
  region = "us-east-1"
  default_tags {
    tags = {
      Project = "Mediverse"
      ManagedBy = "Terraform"
      Environment = "prod"
    }
  }
}
