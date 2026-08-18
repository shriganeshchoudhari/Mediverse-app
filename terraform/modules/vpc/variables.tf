variable "environment" { type = string }
variable "vpc_cidr" { type = string }
variable "public_subnets" { type = list(string) }
variable "private_subnets" { type = list(string) }
variable "secure_subnets" { type = list(string) }
variable "azs" { type = list(string) }
