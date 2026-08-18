module "aurora" {
  source  = "terraform-aws-modules/rds-aurora/aws"
  version = "~> 9.0"

  name           = "${var.environment}-mediverse-pg"
  engine         = "aurora-postgresql"
  engine_version = "16.1"
  instances = {
    1 = { instance_class = "db.r7g.large" }
    2 = { instance_class = "db.r7g.large" }
  }

  vpc_id               = var.vpc_id
  subnets              = var.secure_subnet_ids
  create_db_subnet_group = true

  storage_encrypted   = true
  apply_immediately   = true
  skip_final_snapshot = true

  # Security Group
  vpc_security_group_ids = [aws_security_group.rds.id]
}

resource "aws_security_group" "rds" {
  name_prefix = "${var.environment}-rds-sg"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr] # Allow from anywhere in VPC
  }
}
