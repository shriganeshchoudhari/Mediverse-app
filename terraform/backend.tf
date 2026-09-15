# INFRA-03: Central Terraform Remote State Configuration
# Stores root infrastructure state in encrypted S3 with DynamoDB distributed state locking
terraform {
  backend "s3" {
    bucket         = "mediverse-terraform-state-prod"
    key            = "platform/root/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "mediverse-terraform-locks"
  }
}
