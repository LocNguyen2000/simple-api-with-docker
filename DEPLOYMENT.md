# Deployment 2 ways:

Requirements: Github Actions

## 1. Github -> EC2

- 1.1. Github push code to EC2, copy .ENV from Github Action
- 1.2. Download docker on EC2 by shell script, run Docker build image from startup.sh

## 2. Github -> Dockerhub -> EC2

- 2.1. Github push code to image in Dockerhub
- 2.2. Access EC2 > download image & copy .ENV to image source code
- 2.3. Run image interactively
