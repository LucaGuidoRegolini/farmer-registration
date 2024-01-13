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
      command: aws configure set aws_access_key_id ${var.AWS_ACCESS_KEY_ID}
    - name: Config AWS account secret access key
      command: aws configure set aws_secret_access_key ${var.AWS_SECRET_ACCESS_KEY}
    - name: Config AWS account default region
      command: aws configure set default.region ${var.AWS_REGION}

    - name: Authenticate with ECR
      shell: "aws ecr get-authorization-token --region ${var.AWS_REGION}
      register: ecr_command

    - set_fact:
        ecr_credentials: "{{ (ecr_authorization_data.authorizationToken | b64decode).split(':') | default([]) }}"

    - set_fact:
        ecr_credentials: "{{ (ecr_authorization_data.authorizationToken | b64decode).split(':') | default([]) }}"

    - name: docker_repository - Log into ECR registry and force re-authorization
      docker_login:
        registry_url: "{{ ecr_authorization_data.proxyEndpoint.rpartition('//')[2] | default('') }}"
        username: "{{ ecr_credentials[0] | default('') }}"
        password: "{{ ecr_credentials[1] | default('') }}"
        reauthorize: yes

    - name: Run docker container
      docker_container:
        name: project-container
        image: ${var.AWS_USER_ID}.dkr.ecr.${var.AWS_REGION}.amazonaws.com/${var.repository_name}:latest
        state: started
        restart: yes
        recreate: yes
        pull: yes
        restart_policy: always
        ports:
          - "3000:3000"
EOT

    ansible-playbook playbook.yml -i "localhost," -c local 
    EOF
}
