# See3D-Azure

See3D 3D Printing for the Blind Website

## Running the express Server

### Install Packages

Installs repo packages from package.json
`npm install --save`
`npm install -g nodemon`

### Sample .env File

Defines environment variables for the express server to run on.
`NODE_ENV=dev`
`PORT=8000`
`MONGO_URI=mongodb://localhost:27017/`

### Running the Server

The dev runner uses nodemon's autoreload feature to detect file changes
`npm run dev`

## Leaving the Server on for an extended period of time

pm2 is used for leaving the server on for an extended period of time, because it allows for running multiple node instances at once.
pm2 runs headless, so when you leave the logs the server will stay running.
pm2 instances stop when given a command
pm2 is preinstalled on the see3d servers

### Starting the Server

Run the server headlessly
`pm2 start bin/www`

### Watch Running Logs

View logs of all node code running on pm2
`pm2 logs`

### Stopping the Server

`pm2 stop bin/www`

### View Running node Instances

`pm2 status`
