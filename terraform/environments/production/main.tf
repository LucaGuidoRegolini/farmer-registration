module "prod" {
  source = "../../infra"

  aplication-name = "farmer-register"
    environment = "prod"
    region_aws = "us-east-1"
    repository_name = "farmer-register"
    aplication_port = 3000
    instance_ami_aws = "ami-0fc5d935ebf8bc3bc"
    instance_type_aws = "t2.micro"
    ssh_key_name =  "farmer-register-ssh_id"
    max_size = 2
    min_size = 1
    is_prduction = true

    AWS_ACCESS_KEY_ID = var.TF_VAR_AWS_ACCESS_KEY_ID
    AWS_SECRET_ACCESS_KEY = var.TF_VAR_AWS_SECRET_ACCESS_KEY
    AWS_REGION = var.TF_VAR_AWS_REGION
    AWS_USER_ID = var.TF_VAR_AWS_USER_ID
    ssh_key_public = var.TF_VAR_ssh_key_public
}

