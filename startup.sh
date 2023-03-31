# install docker
sudo yum update
sudo yum search docker
sudo yum install docker
sudo systemctl enable docker.service
sudo systemctl start docker.service

# docker-compose
sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# run compose
docker-compose up -d
