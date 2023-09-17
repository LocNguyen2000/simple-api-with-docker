# install docker on Linux EC2
if [ ! "$(docker --version)" ]; then
    sudo yum update
    sudo yum search docker
    sudo yum -y install docker
    sudo systemctl enable docker
    sudo systemctl restart docker
    echo "Docker installed successfully"
else
    echo "Docker already installed"
fi

# 1, docker build --tag nhlochub/simple-api-with-docker .
# 2, docker image pull nhlochub/simple-api-with-docker
# docker run -d -p 4000:4000 nhlochub/simple-api-with-docker
