resource "aws_launch_template" "app_template" {
  image_id      = var.instance_ami_aws
  name = "${var.aplication-name}-template-${var.environment}"
  instance_type = var.instance_type_aws
  key_name      = aws_key_pair.aws_key_pair.key_name
  
  network_interfaces {
    associate_public_ip_address = true # for debug -> true
    security_groups = [aws_security_group.alb.id]
  }

  user_data = base64encode(templatefile("./ansible.sh", {
    AWS_ACCESS_KEY_ID     = var.AWS_ACCESS_KEY_ID
    AWS_SECRET_ACCESS_KEY = var.AWS_SECRET_ACCESS_KEY
    AWS_REGION            = var.AWS_REGION
    AWS_USER_ID           = var.AWS_USER_ID
    repository_name       = var.repository_name
    aplication_port       = var.aplication_port
  }))
  iam_instance_profile {
    arn = "${aws_iam_instance_profile.ec2_access_ecr_profile.arn}"
  }
   tags = {
    Name = "${var.aplication-name} Launch Template ${var.environment}"
    Aplication = var.aplication-name
    Service = "Launch Template"
    Environment = var.environment
    Terraform: "true"
  }

  depends_on = [ aws_key_pair.aws_key_pair, aws_iam_instance_profile.ec2_access_ecr_profile ]

  count = var.is_prduction ? 1 : 0
}

resource "aws_instance" "app_server" {
  ami           = var.instance_ami_aws
  instance_type = var.instance_type_aws
  key_name      = aws_key_pair.aws_key_pair.key_name

  associate_public_ip_address = true

  vpc_security_group_ids = [aws_security_group.alb.id]

  subnet_id = module.vpc.public_subnets[0]

  iam_instance_profile = aws_iam_instance_profile.ec2_access_ecr_profile.name

  user_data = templatefile("./ansible.sh", {
    AWS_ACCESS_KEY_ID     = var.AWS_ACCESS_KEY_ID
    AWS_SECRET_ACCESS_KEY = var.AWS_SECRET_ACCESS_KEY
    AWS_REGION            = var.AWS_REGION
    AWS_USER_ID           = var.AWS_USER_ID
    repository_name       = var.repository_name
    aplication_port       = var.aplication_port
  })

   tags = {
    Name = "${var.aplication-name} EC2 ${var.environment}"
    Aplication = var.aplication-name
    Service = "EC2"
    Environment = var.environment
    Terraform: "true"
  }

  depends_on = [ aws_key_pair.aws_key_pair, aws_iam_instance_profile.ec2_access_ecr_profile ]

  count = var.is_prduction ? 0 : 1
}

#  resource "aws_cloudwatch_log_group" "autoscaling_log" {
#     name = "/var/log/cloud-init-output.log"  # Substitua pelo caminho real do log se necessário
# }

# resource "aws_cloudwatch_log_stream" "autoscaling_log_stream" {
#   name           = "${var.aplication-name}-${var.environment}-autoscaling-log-stream"
#   log_group_name = aws_cloudwatch_log_group.autoscaling_log.name
# }
