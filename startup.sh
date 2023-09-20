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

# 1, 
sudo docker build --tag nhlochub/simple-api-with-docker .
# 2, sudo docker image pull nhlochub/simple-api-with-docker:main
sudo docker run -d -p 80:4000 nhlochub/simple-api-with-docker
