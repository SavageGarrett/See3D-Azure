const express = require('express');

var app = express();
var path = require('path');

app.get('/sideNavigation', (req, res) => {
  res.sendFile(path.join(__dirname, '..public/html/sideNavigation.html'));
});
