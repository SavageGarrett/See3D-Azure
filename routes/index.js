var express = require('express');
var router = express.Router();
let interaction_handler = require('../interaction_handler.js');
require('dotenv').config();
var path = require('path');
let template_handler = require('./template_handler.js');
let Blog_Post = require('./blog/blog.js')
const formidable = require('formidable');

/*
 * Web Routes
 */

// Acme Challenge for SSL
router.get('/.well-known/acme-challenge/:id', (req, res, next) => {
  let id = req.params.id;
  res.sendFile(path.join(__dirname, `../public/.well-known/acme-challenge/${id}`))
})

// Get Index Page
router.get('/', (req, res, next) => {
  let title = "See3D - 3D Printing for the Blind"

  // If Query is Defined Create Query
  if (req.query !== void 0) var query = req.query;

  // Serve Testimony Page If Query Exists and fname is correct
  if (query.testimony !== void 0) {
    res.render('testimony', { query });
  } else {
    res.render('index', { title })
  }
  
});

// Post Blog Subscribe Form on Page Footer
router.post('/subscribe', (req, res) => {
  // Get Email From Post Body
  let email = req.body.email;

  // Log Email to Database
  interaction_handler.blogSubscribe(email);

  // Render Subscribe Page
  res.render('subscribe', {email});
});

// Get Blog Subscribers
router.get('/get_subscribers', (req, res) => {
  interaction_handler.retrieveBlogSubs(res);
})

// Post Blog form
router.post('/post_blog', (req, res) => {
  // Validate Username and Password

  // Parse out form separating files and fields
  new formidable.IncomingForm().parse(req, (err, fields, files) => {
    if (err) { // Catch and handle error
      console.log("Error Processing Blog Post Form");
    } else {
      // Create new object to store blog post information
      let blog_post = new Blog_Post(fields.article_title, fields.categories, fields.paragraph, fields.article_description, fields.alt_text);

      // Store blog post and files
      blog_post.store(res, files);
    }
  });
});

// Serve Page Routes
router.get('/:fname', (req, res, next) => {
  // Strip File Names for Link Compatability
  let fname_split = req.params.fname.split('.');
  let fname = req.params.fname;

  // If Query is Defined Create Query
  if (req.query !== void 0) {
    var query = req.query
  }


  // Serve Testimony Page If Testimony Query in URL
  if (query.testimony !== void 0) {
    res.render('testimony', { query });
  } else if (query.model_kit !== void 0) { // Serve Model Kit Page if Model Kit Query in URL
    res.render('model_kit', { query })
  }


  // Serve Pages and files based on their name
  switch (fname_split[0]) {
    case "favicon": // Favicon Icon
      res.sendFile(path.join(__dirname, "../public/favicon.ico"));
      break;
    case "index": // Home Page
      let title = "See3D - 3D Printing for the Blind"
      res.render('index', { title })
      break;
    case "elements":
      // Send Elements Page
      res.sendFile(path.join(__dirname, "../public/new_site/html/elements.html"));
      break;
    case "gallery":
      // Handle Gallery
      template_handler.gallery(res, req.query.p);
      break;
    case "blog":
      // Handle Blog
      template_handler.blog(res, req.query);
      break;
    case "donate":
      res.render('donate');
      break;
    case "about":
      res.render('about');
      break;
    case "contact":
      next();
      //res.render('contact');
      break;
    case "get_involved":
      res.render('get_involved');
      break;
    case "request_info":
      res.render('request_info');
      break;
    case "team":
      res.render('team');
      break;
    case "request":
      next();
      //res.render('request');
      break;
    case "post_blog.html":
      res.sendFile(path.join(__dirname, '../public/new_site/html/post_blog.html'))
      break;
    case "release":
      res.render('release');
      break;
    case "board":
      res.render('board_members');
      break;
    case "analytics":
      res.render('analytics');
      break;
    case "accessibility":
      res.render('accessibility');
    case "aslmodels":
      res.render('aslmodels');
      break;
    case "recycle_filament":
      res.render('recycle_filament');
      break;
    default:
      res.sendFile(path.join(__dirname, `../public/new_site/html/${fname}`));
      break;
  }
});

// Route php requests that had directory on old server to index
router.get('/:dirname/:fname', (req, res, next) => {
  let fname = req.params.fname;

  // Redirect PHP pages from old site link
  if (fname.includes('.php')) {
    res.redirect('/')
  } else {
    // Pass On Request to 404 Handler
    next();
  }
})

// Serve CSS Files
router.get('/css/:fname', (req, res, next) => {
  let fname = req.params.fname;
  res.sendFile(path.join(__dirname, `/../public/new_site/css/${fname}`));
});

// Serve JavaScript Files
router.get('/js/:fname', (req, res, next) => {
  let fname = req.params.fname;
  res.sendFile(path.join(__dirname, `/../public/new_site/js/${fname}`));
});

// Serve Javascript Files
router.get('/js/:dirname/:fname', (req, res, next) => {
  let fname = req.params.fname;
  let dirname = req.params.dirname;
  res.sendFile(path.join(__dirname, `/../public/new_site/js/${dirname}/${fname}`));
});

// Serve Font Files
router.get('/fonts/:fname', (req, res, next) => {
  let fname = req.params.fname;
  res.sendFile(path.join(__dirname, `/../public/new_site/fonts/${fname}`));
});

// Serve Image Files
router.get('/img/:fname', (req, res, next) => {
  let fname = req.params.fname;
  res.sendFile(path.join(__dirname, `/../public/new_site/img/${fname}`));
});

// Serve Image Files
router.get('/img/:dirname/:fname', (req, res, next) => {
  let fname = req.params.fname;
  let dirname = req.params.dirname;
  res.sendFile(path.join(__dirname, `/../public/new_site/img/${dirname}/${fname}`));
});

// Serve Image Files
router.get('/img/:dirname/:dirname2/:fname', (req, res, next) => {
  let fname = req.params.fname;
  let dirname = req.params.dirname;
  let dirname2 = req.params.dirname2;
  res.sendFile(path.join(__dirname, `/../public/new_site/img/${dirname}/${dirname2}/${fname}`));
});

// Serve Resume Files
router.get('/documents/:name', (req, res, next) => {
  let name = req.params.name;
  res.sendFile(path.join(__dirname, `/../public/new_site/resume/${name}`));
})

// Serve Resume Files
router.get('/documents/:dirname1/:name', (req, res, next) => {
  let dirname1 = req.params.dirname1;
  let name = req.params.name;
  res.sendFile(path.join(__dirname, `/../public/new_site/documents/${dirname1}/${name}`));
})

// Serve Resume Files
router.get('/documents/:dirname1/:dirname2/:name', (req, res, next) => {
  let dirname1 = req.params.dirname1;
  let dirname2 = req.params.dirname2;
  let name = req.params.name;

  try {
    res.sendFile(path.join(__dirname, `/../public/new_site/documents/${dirname1}/${dirname2}/${name}`));
  } catch (error) {
    console.log(`Invalid Document Attempted: documents/${dirname1}/${dirname2}/${name}`);

    // Redirect to Index
    res.redirect('/')
  }
  
})

module.exports = router;
