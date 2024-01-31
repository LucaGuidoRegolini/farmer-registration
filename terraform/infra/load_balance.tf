# Load Balance - the load balance is the service that will balance the requests
resource "aws_lb" "load_balance_project" {
  name = "${var.aplication-name}-${var.environment}"
  internal = false
  subnets  = module.vpc.public_subnets
   tags = {
    Name = "${var.aplication-name} Load Balance ${var.environment}"
    Aplication = var.aplication-name
    Service = "Load Balance"
    Environment = var.environment
    Terraform: "true"
  }

  security_groups = [aws_security_group.alb.id]

  count = var.is_prduction ? 1 : 0
}


# Target Group - the target group is the group of instances that will be balanced
# Saida do load balance
resource "aws_lb_target_group" "load_balance_target_project" {
  name     = "${var.aplication-name}-target-${var.environment}"
  port     = var.aplication_port
  protocol = "HTTP"
  vpc_id   = module.vpc.vpc_id
  count = var.is_prduction ? 1 : 0
}

# Listener - the listener is the port that will be exposed to the world
# Entrada do load balance
resource "aws_lb_listener" "load_balance_listener_project" {
  load_balancer_arn = aws_lb.load_balance_project[0].arn
  port              = var.aplication_port
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.load_balance_target_project[0].arn
  }
  count = var.is_prduction ? 1 : 0
}


