var express = require('express');
var secured = require('../middleware/secured');
const interaction_handler = require('../interaction_handler');
const template_handler = require('./template_handler');
var router = express.Router();

/* GET user profile. */
router.get('/user', secured(), function (req, res, next) {
  // Set User Roles to Global Variable
  interaction_handler.setUserRoles(req);

  // Render User Page with User Profile
  res.render('user', {
    userProfile: JSON.stringify(global.profile, null, 2),
    title: 'Profile page'
  });
});

router.get('/admin', secured(), function (req, res, next) {
  // Set User Roles to Global Variable
  interaction_handler.setUserRoles(req);

  let mongo_fetchers = [];
  mongo_fetchers.push(template_handler.blog_edit())

  Promise.all(mongo_fetchers)
    .then((dataArray) => {
      let blog_data = dataArray[0];
      console.log(blog_data)
      res.render('admin', { admin: true, userProfile: JSON.stringify(global.profile, null, 2), blog: JSON.stringify(blog_data, null, 2) })
    })
    .catch((err) => {
      res.sendStatus(500).end();
    })
});

module.exports = router;