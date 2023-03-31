# install docker
sudo yum update
sudo yum search docker
y | sudo yum install docker
sudo systemctl restart docker

# copy env file
cp .env.example .env

# docker-compose
sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# run compose
sudo docker-compose up -d
