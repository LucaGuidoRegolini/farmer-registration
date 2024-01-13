resource "aws_key_pair" "aws_key_pair" {
  key_name   = var.ssh_key_name
  public_key = var.ssh_key_public

  tags = {
    Name = "${var.aplication-name} key pair ${var.environment}"
    Aplication = var.aplication-name
    Service = "Key Pair"
    Environment = var.environment
    Terraform: "true"
  }
}
