terraform {
  backend "s3" {
    bucket = "terraform-state-farmer-register-project"
    key    = "dev/terraform.tfstate"
    region = "us-east-1"
  }
}
