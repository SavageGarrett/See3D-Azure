var express = require('express');
var router = express.Router();
var path = require('path')

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// GET index page
router.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname + '/../public/html/index.html'))
})

router.get('/:fname', (req, res, next) => {
  let fname = req.params['fname']
  res.sendFile(path.join(__dirname + '/../public/html/' + fname))
})

router.post('/requests', (req, res) => {
  if (req.body["text"] === "") res.send("Use \"/requests help\" for instructions")
  else if(req.body["text"] === "help") res.send("")

  let splitCommand = req.body["text"].split(' ')

  if(splitCommand[0] === "assign") {

  } else if (splitCommand[0] === complete)

  console.log(req.body["text"])
});



module.exports = router;
