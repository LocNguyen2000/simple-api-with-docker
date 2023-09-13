# Arguments
ARG NODE_IMAGE=node:16-alpine

FROM ${NODE_IMAGE}

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install
# RUN npm install pm2 -g
# Bundle app source
COPY . .

# Run migration
CMD [ "npm", "run" "start:hmr" ]
EXPOSE 80

