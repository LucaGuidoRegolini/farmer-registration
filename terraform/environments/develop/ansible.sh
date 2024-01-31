#!/bin/bash -x 
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
sudo python3 get-pip.py
sudo python3 -m pip install ansible

echo "Installing ansible dependencies" > /home/ubuntu/log.txt

echo # vars.yml > vars.yml
echo "AWS_REGION: ${AWS_REGION}" >> /home/ubuntu/vars.yml
echo "AWS_USER_ID: ${AWS_USER_ID}" >> /home/ubuntu/vars.yml
echo "AWS_ACCESS_KEY: ${AWS_ACCESS_KEY_ID}" >> /home/ubuntu/vars.yml
echo "AWS_SECRET_KEY: ${AWS_SECRET_ACCESS_KEY}" >> /home/ubuntu/vars.yml
echo "REPOSITORY_NAME: ${repository_name}" >> /home/ubuntu/vars.yml
echo "PORT: ${aplication_port}" >> /home/ubuntu/vars.yml

tee -a /home/ubuntu/playbook.yml > /dev/null <<EOT
- hosts: localhost
  become: yes
  
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
      command: aws configure set aws_access_key_id {{ AWS_ACCESS_KEY }}
    - name: Config AWS account secret access key
      command: aws configure set aws_secret_access_key {{ AWS_SECRET_KEY }}
    - name: Config AWS account default region
      command: aws configure set default.region {{ AWS_REGION }}

    - name: Authenticate with ECR
      shell: "aws ecr get-authorization-token  \
        --region {{ AWS_REGION }}"
      register: ecr_command

    - set_fact:
        ecr_authorization_data: "{{ (ecr_command.stdout | from_json).authorizationData[0] }}"

    - set_fact:
        ecr_credentials: "{{ (ecr_authorization_data.authorizationToken | b64decode).split(':') }}"

    - name: docker_repository - Log into ECR registry and force re-authorization
      docker_login:
        registry_url: "{{ ecr_authorization_data.proxyEndpoint.rpartition('//')[2] }}"
        username: "{{ ecr_credentials[0] }}"
        password: "{{ ecr_credentials[1] }}"
        reauthorize: yes

    - name: Run docker container
      docker_container:
        name: project-container
        image: "{{ AWS_USER_ID }}.dkr.ecr.{{AWS_REGION}}.amazonaws.com/{{ REPOSITORY_NAME }}:latest"
        state: started
        restart: yes
        recreate: yes
        pull: yes
        restart_policy: always
        ports:
          - "{{ PORT }}:{{ PORT }}"

EOT

echo "Playbook created" >> /home/ubuntu/log.txt

sudo ansible-playbook -vvv /home/ubuntu/playbook.yml -e "@/home/ubuntu/vars.yml" >> /home/ubuntu/log.txt

echo "Ansible dependencies installed" >> /home/ubuntu/log.txt
