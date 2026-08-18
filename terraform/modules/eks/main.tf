module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = "${var.environment}-mediverse-cluster"
  cluster_version = "1.30"

  cluster_endpoint_public_access  = true
  cluster_endpoint_private_access = true

  vpc_id                   = var.vpc_id
  subnet_ids               = var.private_subnet_ids
  control_plane_subnet_ids = var.private_subnet_ids

  # Karpenter prerequisites
  enable_irsa = true

  eks_managed_node_groups = {
    core_node_group = {
      min_size     = 3
      max_size     = 10
      desired_size = 3

      instance_types = ["m6i.xlarge"]
      capacity_type  = "ON_DEMAND"
    }
  }

  tags = {
    Environment = var.environment
  }
}
