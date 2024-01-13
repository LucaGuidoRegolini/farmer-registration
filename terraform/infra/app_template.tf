resource "aws_launch_template" "app_template" {
  image_id      = var.instance_ami_aws
  name = "${var.aplication-name}-template-${var.environment}"
  instance_type = var.instance_type_aws
  key_name      = var.ssh_key_name
  iam_instance_profile {
    name = aws_iam_role.ec2_access_ecr.arn
  }
   tags = {
    Name = "${var.aplication-name} Launch Template ${var.environment}"
    Aplication = var.aplication-name
    Service = "Launch Template"
    Environment = var.environment
    Terraform: "true"
  }


  vpc_security_group_ids = [aws_security_group.alb.id]
  user_data = data.template_file.init.rendered

  depends_on = [ aws_key_pair.aws_key_pair, aws_iam_instance_profile.ec2_access_ecr_profile ]

  count = var.is_prduction ? 1 : 0
}

resource "aws_instance" "app_server" {
  ami           = var.instance_ami_aws
  instance_type = var.instance_type_aws
  key_name      = var.ssh_key_name

  associate_public_ip_address = true

  vpc_security_group_ids = [aws_security_group.alb.id]

  subnet_id = module.vpc.public_subnets[0]

  iam_instance_profile = aws_iam_instance_profile.ec2_access_ecr_profile.name

  user_data = data.template_file.init.rendered

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
