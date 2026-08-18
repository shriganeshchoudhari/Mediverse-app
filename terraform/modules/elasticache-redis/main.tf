resource "aws_elasticache_subnet_group" "redis" {
  name       = "${var.environment}-redis-subnet-group"
  subnet_ids = var.secure_subnet_ids
}

resource "aws_elasticache_replication_group" "redis" {
  replication_group_id          = "${var.environment}-mediverse-redis"
  description                   = "Redis cluster for Mediverse"
  node_type                     = "cache.t4g.medium"
  num_cache_clusters            = 3
  port                          = 6379
  parameter_group_name          = "default.redis7.cluster.on"
  automatic_failover_enabled    = true
  subnet_group_name             = aws_elasticache_subnet_group.redis.name
  security_group_ids            = [aws_security_group.redis.id]
  at_rest_encryption_enabled    = true
  transit_encryption_enabled    = true
}

resource "aws_security_group" "redis" {
  name_prefix = "${var.environment}-redis-sg"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }
}
