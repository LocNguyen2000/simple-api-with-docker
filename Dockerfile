# Arguments
ARG NODE_IMAGE=node:16-alpine

FROM ${NODE_IMAGE}

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY . .

RUN npm install

# Run migration
CMD [ "npm", "run", "start:docker" ]
EXPOSE 80

