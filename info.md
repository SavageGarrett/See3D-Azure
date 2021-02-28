# See3D Tech Documentation
This should serve as a reference for navigation of the See3D code base

## Table of Contents:
- [See3D Tech Documentation](#see3d-tech-documentation)
  * [Running the Server on Your Machine](#running-the-server-on-your-machine)
    + [Sample .env File:](#sample-env-file-)
    + [Install Node Dependencies](#install-node-dependencies)
    + [Install Dev Runner](#install-dev-runner)
    + [Run Server](#run-server)
    + [Viewing Live Server](#viewing-live-server)
  * [Run Server on Production](#run-server-on-production)
    + [Putting Server Down for Maintenance](#putting-server-down-for-maintenance)
  * [Packages and File Structure](#packages-and-file-structure)
  * [Maintenance and Potential Issues](#maintenance-and-potential-issues)
    + [Troubleshooting](#troubleshooting)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>


## Running the Server on See3D Server
You must first install npm and node.js on your terminal. You can do this by visiting https://nodejs.org/en/.

Once you have installed these and cloned the git repository, you will have to create a .env file at the root directory of the repository, which defines the ports the code base runs on. Change NODE_ENV variable to production, if you would like to use the secure ports. (Requires cert files present at directory set in bin/www)

### Sample .env File:
```
# Environment Being Used
NODE_ENV=development

# Web Server Ports
# Ports 8080 to 8100 are opened for development
PORT=8089
SECURE_PORT=8090

# MongoDB Connection URI
MONGO_URI=mongodb://localhost:27017/
```

### Install Node Dependencies
```
npm install --save
```

### Install Dev Runner
```
npm install -g nodemon
```

### Run Server
```
nodemon bin/www
```

### Viewing Live Server

To view the live web server go to http://localhost:8089. Change 8089 to whatever you set in your .env file.

Run command rs in nodemon to restart. Server will auto restart everytime a .js file is changed.

## Run Server on Production

The production server is ran using a service called pm2. This service is already installed on the see3d Azure VM. The pm2 service must be ran as root.

**Common pm2 commands:**
```
# Start
# add --watch to enable file watching for testing/debugging
sudo pm2 start <id> or path/to/.js

# Stop
sudo pm2 stop <id> or path/to/.js

# Restart
sudo pm2 restart <id> or path/to/.js

# View Running Logs
sudo pm2 logs <id> or path/to/.js
```

### Putting Server Down for Maintenance
The code below contains information on how to put the see3d.com site down, which displays a down for maintenance page on see3d.org. This is used when merging in changes, that could potentiall break the site.
```
# Navigate to home directory
cd /home/see3d

# Put Production Server down and Maintenance Site up
sudo sh maintenance.sh down

# Put Production Server up and Maintenance Site down
sudo sh maintenance.sh up

# This script is dependent on the id of the production server being 1 and the id of the maintenance server being 2, inside of pm2
```


## Packages and File Structure

This serves as building blocks, for understanding the see3d tech stack. This is not inclusive of all files contained, but provides a general overview, and will give a guide of where to go when debugging.

**Packages:**

The server is built on a node library called express, which can be seen at http://expressjs.com/
Going to the getting started tab will give you a good idea of how express applications work. They can be equivocated to writing an API, which serves html pages.

The server also runs on a templating engine called pug. Pug allows you to render pages by mixing in javascript variables, and injecting snippets of html like code. This quick guide should serve as a reference to writing pug code.

**File Structure:**
- bin/
	- www
- node_modules/
	- node packages
- public/
	- new_site/
		- css/
		- documents/
		- fonts/
		- html/
		- img/
		- js/
		- scss/
- routes/
	- index.js
- views/
	- *.pug
- app.js

**Overview of Files**
**bin/www** is the start file, and defines the port the server runs on, the SSL certificate definition for running https, a link to where the app object is contained, and the error handler.

**app.js** is the app object. This object stores the location of the application routes, middlewares, and error page handlers.

**views/*.pug** is where the html templates are stored, and is where you can add new pages with the file extension .pug

**routes/index.js** contains the http routes for the application. 

**public/\*** public files for frontend. css files, frontend javascript files, fonts, documents, and images

If you would like to add a page, locate the section of code in routes/index.js:
```
// New routes can be handled by adding another case in this section of code in routes/index.js
// Example: the case "index" creates the route see3d.org/index and will render the index.pug file passing the variable title for the pug code to use
switch (fname_split[0]) {
      // Send Favicon File
      case "favicon":
        res.sendFile(path.join(__dirname, "../public/favicon.ico"));
        break;
	  // Render index page sending title as a parameter to use
      case "index":
        let title = "See3D - 3D Printing for the Blind"
        res.render('index', { title })
        break;
	  // Send a static file from public folder
      case "elements":
        // Send Elements Page
        res.sendFile(path.join(__dirname, "../public/new_site/html/elements.html"));
        break;
	  // Call separate function to handle page
      case "gallery":
        // Handle Gallery
        template_handler.gallery(res, req.query.p);
        break;
}
```

## Maintenance and Potential Issues

Routine maintenance will entail updating node packages and renewing the SSL certification.

**SSL Cert Renew:**
```
# Renew SSL Certs
sudo certbot renew

# Run on running web server. Place in acme challenge in acme challenge folder served in routes.js.
# The route is written to automatically locate whatever is placed in the acme challenge folder.
# The server may need restarted to reflect this new change.

# A script is ran at midnight on the first day of every month, which attempts to renew the ssl cert and restart production.
# This script can cause errors if production is down and backup is up.
# The logs for this script can be viewed at /home/see3d/logs/cert.log
```

**Update Node Packages**
```
# Look for packages that need updated, due to security risks
npm audit

# Update these Packages
npm audit fix
```

### Troubleshooting
If the server is running slow, a restart will usually fix it. It is important to first check the logs. If they are quickly flooding with requests, the server is experiencing high population. If this is the case, it is a good idea to expand the VM on azure, and look into serving the files in the public folder from a CDN. If one route is being pinged constantly, it is potentially a bug or an attack. In this case, restart the server and contact azure if the issue persists.
