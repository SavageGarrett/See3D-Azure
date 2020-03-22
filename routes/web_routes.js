var express = require('express');
var router = express.Router();
var path = require('path');

// GET index page
router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '/../public/old_site/html/index.html'));
})

// GET index page
router.get('/index', (req, res, next) => {
    res.sendFile(path.join(__dirname, '/../public/old_site/html/index.html'));
})

// GET files from pages sub-directories
router.get('/pages/:dirname/:fname', (req, res, next) => {
    let dirname = req.params['dirname'];
    let fname = req.params['fname'];
    res.sendFile(path.join(__dirname, `/../public/old_site/html/pages/${dirname}/${fname}.html`));
})

// GET files from pages directory
router.get('/pages/:fname', (req, res, next) => {
    let fname = req.params['fname'];
    res.sendFile(path.join(__dirname, `/../public/old_site/html/pages/${fname}.html`));
})

// GET favicon
router.get('/favicon.ico', (req, res, next) => {
    res.sendFile(path.join(__dirname, '/../public/favicon.ico'));
})

// GET js files
router.get('/js/:fname', (req, res, next) => {
    let fname = req.params['fname'];
    res.sendFile(path.join(__dirname, `/../public/old_site/js/${fname}`));
})

// GET css files
router.get('/css/:fname', (req, res, next) => {
    let fname = req.params['fname'];
    res.sendFile(path.join(__dirname, `/../public/old_site/css/${fname}`));
})

// GET css files
router.get('/stylesheets/:fname', (req, res, next) => {
    let fname = req.params['fname'];
    res.sendFile(path.join(__dirname, `/../public/old_site/css/${fname}`));
})

// GET image files
router.get('/img/:fname', (req, res, next) => {
    let fname = req.params['fname'];
    res.sendFile(path.join(__dirname, `/../public/old_site/img/${fname}`));
})

// GET error page
router.get('/error', (req, res, next) => {
    res.sendFile(path.join(__dirname, '/../public/old_site/html/error.html'))
})

// GET error page if no other page
router.get('/:otherpage', (req, res, next) => {
    res.sendFile(path.join(__dirname, '/../public/old_site/html/error.html'))
})

module.exports = router;