var express = require('express');
var router = express.Router();
let interaction_handler = require('../interaction_handler.js');
require('dotenv').config();
var path = require('path');
let templateHandler = require('./templateHandler.js');

/*
 * Web Routes
 */

// Get Index Page
router.get('/', async (req, res, next) => {
  // If Query is Defined Create Query
  if (req.query !== void 0) var query = req.query;

  // Serve Testimony Page If Query Exists and fname is correct
  if (query.testimony !== void 0) {
    res.render('testimony', { query });
  } else {
    await templateHandler.indexPage(res);
  }
});

// Post Blog Subscribe Form on Page Footer
router.post('/subscribe', (req, res) => {
  // Get Email From Post Body
  let email = req.body.email;

  // Log Email to Database
  interaction_handler.blogSubscribe(email);

  // Render Subscribe Page
  res.render('subscribe', { email });
});

// Get Blog Subscribers
router.get('/get_subscribers', (req, res) => {
  interaction_handler.retrieveBlogSubs(res);
});

// Serve Page Routes
router.get('/:fname', async (req, res, next) => {
  // Strip File Names for Link Compatability
  let fname_split = req.params.fname.split('.');
  let fname = req.params.fname;

  // If Query is Defined Create Query
  if (req.query !== void 0) {
    var query = req.query;
  }

  // Serve Testimony Page If Testimony Query in URL
  if (query.testimony !== void 0) {
    res.render('testimony', { query });
  } else if (query.model_kit !== void 0) {
    // Serve Model Kit Page if Model Kit Query in URL
    res.render('model_kit', { query });
  }

  // Serve Pages and files based on their name
  switch (fname_split[0]) {
    case 'favicon': // Favicon Icon
      res.sendFile(path.join(__dirname, '../public/favicon.ico'));
      break;
    case 'index': // Home Page
      await templateHandler.indexPage(res);
      break;
    case 'elements':
      // Send Elements Page
      res.sendFile(path.join(__dirname, '../public/html/elements.html'));
      break;
    case 'gallery':
      // Handle Gallery
      await templateHandler.gallery(res, req.query.p);
      break;
    case 'blog':
      await templateHandler.blog(res, req.query);
      break;
    case 'donate':
      res.render('donate');
      break;
    case 'about':
      res.render('about');
      break;
    case 'contact':
      next();
      //res.render('contact');
      break;
    case 'get_involved':
      res.render('get_involved');
      break;
    case 'request_info':
      res.render('request_info');
      break;
    case 'team':
      await templateHandler.teamPage(res);
      break;
    case 'request':
      next();
      //res.render('request');
      break;
    case 'post_blog.html':
      res.sendFile(path.join(__dirname, '../public/html/post_blog.html'));
      break;
    case 'release':
      res.render('release');
      break;
    case 'board':
      await templateHandler.boardPage(res);
      break;
    case 'analytics':
      res.render('analytics');
      break;
    case 'accessibility':
      res.render('accessibility');
      break;
    case 'aslmodels':
      res.render('aslmodels');
      break;
    case 'recycle_filament':
      res.render('recycle_filament');
      break;
    case 'privacy-policy':
      res.sendFile(
        path.join(__dirname, '../public/documents/legal/privacy_policy.docx')
      );
      break;
    case 'terms-of-use':
      res.sendFile(
        path.join(__dirname, '../public/documents/legal/terms_of_use.docx')
      );
      break;
    default:
      res.sendFile(path.join(__dirname, `../public/html/${fname}`));
      break;
  }
});

// Serve files from various directories recursively
router.get('/:type/*', (req, res) => {
  const type = req.params.type; // 'css', 'js', 'img', 'fonts', 'documents'
  const filePath = req.params[0]; // Capture all following path segments
  let basePath = '';

  switch (type) {
    case 'css':
      basePath = '../public/css';
      break;
    case 'js':
      basePath = '../public/js';
      break;
    case 'img':
      basePath = '../public/img';
      break;
    case 'fonts':
      basePath = '../public/fonts';
      break;
    case 'documents':
      basePath = '../public/documents';
      break;
    default:
      // Handle unknown type
      return res.status(404).send('Resource not found');
  }

  const fullPath = path.join(__dirname, basePath, filePath);

  res.sendFile(fullPath, function (err) {
    if (err) {
      console.log(`Error sending file: ${fullPath}`);
      if (err.status === 404) {
        res.status(404).send('File not found');
      } else {
        res.status(500).send('Server error');
      }
    }
  });
});

module.exports = router;
