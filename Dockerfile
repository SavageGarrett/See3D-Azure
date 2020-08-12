# set the version of node to use
FROM node:14.7.0

# set the working directory for docker
# I'm not sure if it should be here or not, but it builds so we can deal with that later
WORKDIR /

# copy package*.json over to the docker instance working directory
COPY package*.json ./

# set up npm dependencies
RUN npm install -g

# for some reason this needs to be installed manually
RUN npm install request

# copy everything else over to the docker instance
COPY . .

# set the port that docker will open for this instance
EXPOSE 8080

# start nodejs in the container
CMD [ "npm", "start" ]
