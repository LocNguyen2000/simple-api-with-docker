# install docker on Linux EC2
if [ ! "$(docker --version)" ]; then
    sudo yum update
    sudo yum search docker
    sudo yum -y install docker 

    # sudo usermod -a -G docker ec2-user
    # id ec2-user
    # # Reload a Linux user's group assignments to docker w/o logout
    # newgrp docker
    sudo systemctl enable docker
    echo "Docker installed successfully"
else
    echo "Docker already installed"
fi

# 1, docker build --tag nhlochub/simple-api-with-docker .
# 2, docker image pull nhlochub/simple-api-with-docker
#
