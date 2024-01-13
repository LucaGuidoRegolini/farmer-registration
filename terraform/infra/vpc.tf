module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "vpc-ecs"
  cidr = "10.0.0.0/16" # 10.0.0.0 - 10.0.255.255

  azs             = ["${var.region_aws}a", "${var.region_aws}b", "${var.region_aws}c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  # enable_nat_gateway = true
  enable_vpn_gateway = false

  tags = {
    Name = "${var.aplication-name} VPC ${var.environment}"
    Aplication = var.aplication-name
    Service = "VPC"
    Environment = var.environment
    Terraform: "true"
  }
}
