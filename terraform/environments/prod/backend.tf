# INFRA-03: Production Environment Remote State Configuration
terraform {
  backend "s3" {
    bucket         = "mediverse-terraform-state-prod"
    key            = "platform/prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "mediverse-terraform-locks"
  }
}
