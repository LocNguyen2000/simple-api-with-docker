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

# 1, Stop & Remove all running container/images
sudo docker stop $(sudo docker ps -a -q)
sudo docker system prune -a

# 2, 
# sudo docker build --tag nhlochub/simple-api-with-docker .
sudo docker image pull nhlochub/simple-api-with-docker:main
sudo docker run -d --env-file ./.env -p 80:4000 nhlochub/simple-api-with-docker:main 
