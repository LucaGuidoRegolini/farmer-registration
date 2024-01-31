resource "aws_iam_role" "ec2_access_ecr" {
  name = "${var.aplication-name}-${var.environment}-access_ecr_ec2"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = {
        Service = [
            "ec2.amazonaws.com"
            
        ]
      }
    }]
  })
}
resource "aws_iam_role_policy" "ecs_ecr_policy_ec2" {
  name = "${var.aplication-name}-${var.environment}-ecs_ecr_policy_ec2"
  role = aws_iam_role.ec2_access_ecr.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "ecr:*"
        ]
        Effect   = "Allow"
        Resource = "*"
      },
    ]
  })
}

resource "aws_iam_role_policy" "ecs_logs_policy_ec2" {
  name = "${var.aplication-name}-${var.environment}-ecs_ecr_policy_ec2"
  role = aws_iam_role.ec2_access_ecr.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "cloudtrail:LookupEvents",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:CreateLogGroup",
          "logs:DescribeLogGroups",
          "logs:DescribeLogStreams" 
        ]
        Effect   = "Allow"
        Resource = "*"
      },
    ]
  })
}

resource "aws_iam_instance_profile" "ec2_access_ecr_profile" {
    name = "${var.aplication-name}-${var.environment}-access_ecr_ec2_profile"
    
    role = aws_iam_role.ec2_access_ecr.name

    tags = {
        Name = "${var.aplication-name} EC2 Access ECR Profile ${var.environment}"
        Aplication = var.aplication-name
        Service = "IAM Instance Profile"
        Environment = var.environment
        Terraform: "true"
    }
} 
