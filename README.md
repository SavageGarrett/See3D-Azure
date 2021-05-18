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