terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "mediverse-terraform-state-prod"
    key            = "environments/prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "mediverse-terraform-locks-prod"
    encrypt        = true
  }
}

module "vpc" {
  source = "../../modules/vpc"
  environment     = "prod"
  vpc_cidr        = "10.0.0.0/16"
  azs             = ["us-east-1a", "us-east-1b", "us-east-1c"]
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  private_subnets = ["10.0.4.0/22", "10.0.8.0/22", "10.0.12.0/22"] # Larger subnets for EKS pods
  secure_subnets  = ["10.0.20.0/24", "10.0.21.0/24", "10.0.22.0/24"] # Isolated subnets for DBs
}

module "eks" {
  source             = "../../modules/eks"
  environment        = "prod"
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
}

module "aurora" {
  source            = "../../modules/rds-postgres"
  environment       = "prod"
  vpc_id            = module.vpc.vpc_id
  secure_subnet_ids = module.vpc.secure_subnet_ids
  vpc_cidr          = "10.0.0.0/16"
}

module "redis" {
  source            = "../../modules/elasticache-redis"
  environment       = "prod"
  vpc_id            = module.vpc.vpc_id
  secure_subnet_ids = module.vpc.secure_subnet_ids
  vpc_cidr          = "10.0.0.0/16"
}
