data "template_file" "init" {
  template = <<-EOF
    #!/bin/bash
    curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
    sudo python3 get-pip.py
    sudo python3 -m pip install ansible

tee -a ./playbook.yml > /dev/null <<EOT
- hosts: localhost
  become: true
  tasks:
    - name: Install aptitude
      apt:
        name: aptitude
        state: latest
        update_cache: yes

    - name: Install required system packages
      apt:
        pkg:
          - apt-transport-https
          - ca-certificates
          - curl
          - software-properties-common
          - python3-pip
          - virtualenv
          - python3-setuptools
        state: latest

    - name: Add Docker GPG apt Key
      apt_key:
        url: https://download.docker.com/linux/ubuntu/gpg
        state: present

    - name: Add Docker Repository
      apt_repository:
        repo: deb https://download.docker.com/linux/ubuntu focal stable
        state: present

    - name: Install docker
      apt:
        name: docker-ce
        state: latest

    - name: Install Docker Module for Python
      pip:
        name: docker

    - name: Install AWS CLI
      apt:
        name: awscli
        state: latest

    - name: Config AWS account access key
      command: aws configure set aws_access_key_id AKIAWMM5FWHYYL77JXGV
    - name: Config AWS account secret access key
      command: aws configure set aws_secret_access_key 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
    - name: Config AWS account default region
      command: aws configure set default.region us-east-1

    - name: Authenticate with ECR
      shell: "aws ecr get-authorization-token --region us-east-1"
      register: ecr_command

    - set_fact:
        ecr_authorization_data: "{{ (ecr_command.stdout | from_json).authorizationData[0] }}

    - set_fact:
        ecr_credentials: "{{ (ecr_authorization_data.authorizationToken | b64decode).split(':') }}

    - name: docker_repository - Log into ECR registry and force re-authorization
      docker_login:
        registry_url: "{{ ecr_authorization_data.proxyEndpoint.rpartition('//')[2] }}
        username: "{{ ecr_credentials[0] }}
        password: "{{ ecr_credentials[1] }}
        reauthorize: yes

    - name: Run docker container
      docker_container:
        name: project-container
        image: 438953161201.dkr.ecr.us-east-1.amazonaws.com/farmer-register:latest
        state: started
        restart: yes
        recreate: yes
        pull: yes
        restart_policy: always
        ports:
          - "3000:3000"
EOT

    ansible-playbook playbook.yml -i "localhost," -c local -e "AWS_REGION=us-east-1" -e "AWS_USER_ID=438953161201" -e "AWS_ACCESS_KEY=AKIAWMM5FWHYYL77JXGV" -e "AWS_SECRET_KEY=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" -e "PORT=3000" -e "REPOSITORY_NAME=farmer-register"
    EOF
}
