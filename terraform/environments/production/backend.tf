terraform {
  backend "s3" {
    bucket = "terraform-state-farmer-register-project"
    key    = "prod/terraform.tfstate"
    region = "us-east-1"
  }
}
