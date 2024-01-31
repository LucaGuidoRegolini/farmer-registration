resource "aws_eip" "project_lb" {
  instance = aws_instance.app_server[0].id
  domain   = "vpc"

 depends_on = [ aws_instance.app_server ]

  tags = {
    Name = "${var.aplication-name} ip ${var.environment}"
    Aplication = var.aplication-name
    Service = "Elastic IP"
    Environment = var.environment
    Terraform: "true"
  }

  count = var.is_prduction ? 0 : 1
}


