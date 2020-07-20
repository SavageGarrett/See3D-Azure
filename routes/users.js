var express = require('express');
var secured = require('../middleware/secured');
var router = express.Router();

/* GET user profile. */
router.get('/user', secured(), function (req, res, next) {
  res.render('user', {
    userProfile: JSON.stringify(global.profile, null, 2),
    title: 'Profile page'
  });
});

router.get('/admin', secured(), function (req, res, next) {
  res.render('admin')
});

module.exports = router;