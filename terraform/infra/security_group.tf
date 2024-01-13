resource "aws_security_group" "alb" {
  name   = "alb_ECS_${var.environment}"
  vpc_id = module.vpc.vpc_id

  tags = {
    Name = "${var.aplication-name} alb ${var.environment}"
    Aplication = var.aplication-name
    Service = "Security Group"
    Environment = var.environment
    Terraform: "true"
  }
}

resource "aws_security_group_rule" "tcp_alb_ingress_http" {
  type              = "ingress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.alb.id
}

resource "aws_security_group_rule" "tcp_alb_ingress_project" {
  type              = "ingress"
  from_port         = var.aplication_port
  to_port           = var.aplication_port
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.alb.id
}


resource "aws_security_group_rule" "tcp_alb_ingress_ssh" {
  type              = "ingress"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.alb.id
}

resource "aws_security_group_rule" "tcp_alb_egress" {
  type              = "egress"
  from_port         = 0 # 0 - 0 all ports
  to_port           = 0
  protocol          = "-1"          # -1 all protocols
  cidr_blocks       = ["0.0.0.0/0"] # 0.0.0.0 - 255.255.255.255
  security_group_id = aws_security_group.alb.id
}
