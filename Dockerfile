# Arguments
ARG NODE_IMAGE=node:16-alpine

FROM ${NODE_IMAGE}

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install
# Bundle app source
COPY . .
EXPOSE 4000

# Run migration
CMD [ "npm", "start" ]


