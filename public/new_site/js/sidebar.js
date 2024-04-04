import express from 'express';

var app = express();
var path = require('path');

app.get('/sideNavigation', (req, res) => {
  res.sendFile(
    path.join(__dirname, '..public/new_site/html/sideNavigation.html')
  );
});
