# Initialize the AWS provider
provider "aws" {
  region = "eu-central-1"  # Update with your desired AWS region
}
resource "aws_security_group" "example" {
  name        = "example-security-group"
  description = "Example security group allowing traffic on port 3000"

  # Define the inbound rule to allow incoming traffic on port 3000
  ingress {
    from_port   = 0
    to_port     = 60000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Adjust this as needed for your specific requirements
  }
}
# Define the EC2 instance resource
resource "aws_instance" "example" {
  ami           = "ami-0ab1a82de7ca5889c"  # Use a valid AMI ID
  instance_type = "t2.medium"               # Specify the instance type
  vpc_security_group_ids = [aws_security_group.example.id] 
  tags = {
    Name = "lightsaber-timeseries-demo"
    OwnerContact = "Pierre.Petersson@mongodb.com"
    owner="pierre.petersson"
    purpose="dotLocal"
    expire-on="2024-06-01"
  }

  # User data script to install software and deploy your apps
  user_data = <<-EOF
              #!/bin/bash
              sudo apt-get update -y
              sudo apt install python3-pip -y
              sudo apt install npm -y
              sudo npm install -g n
              sudo n latest
              
              # Deploy your frontend and backend apps here
              # Example: Clone code from a Git repository, install dependencies, and start the apps
              mkdir -p application
              git clone https://github.com/piemar/lightsaber-mongodb-timeseries.git application/        
              cd application/lightsaber-frontend && npm install 
              npm start &
              cd
              cd application/lightsaber-backend && pip install -r requirements.txt
              nohup python3 app.py &
              EOF
}

# Output the public IP address of the instance
output "public_ip" {
  value = aws_instance.example.public_ip
}
