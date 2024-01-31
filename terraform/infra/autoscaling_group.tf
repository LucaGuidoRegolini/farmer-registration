resource "aws_autoscaling_group" "autoscaling_group" {
  vpc_zone_identifier = module.vpc.public_subnets  # for debug change private_subnets -> public_subnets
  name               = "${var.aplication-name}-asg-${var.environment}"
  
  max_size           = var.max_size
  min_size           = var.min_size
  launch_template {
    id      = aws_launch_template.app_template[0].id
    version = "$Latest"
  }
  depends_on = [ aws_launch_template.app_template ]
  target_group_arns = [aws_lb_target_group.load_balance_target_project[0].arn]
  count = var.is_prduction ? 1 : 0
}

# Autoscaling Policy - the autoscaling policy is the policy that will scale the instances
resource "aws_autoscaling_policy" "autoscaling_policy" {
  name                   = "terraform-escale-alura"
  autoscaling_group_name = "${var.aplication-name}-asg-${var.environment}"
  policy_type            = "TargetTrackingScaling"
  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }
    target_value = 50.0
  }
  depends_on = [ aws_autoscaling_group.autoscaling_group ]
  count = var.is_prduction ? 1 : 0
}

