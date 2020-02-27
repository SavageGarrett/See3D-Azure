var express = require('express');
var router = express.Router();
var path = require('path');
const request = require('request');
let mongoFunctions = require('../mongo.js');
let command_help = require('../public/js/command_help.js');
let hooks = require('../secret/hooks.js');
let verify_admin = require('../secret/users.js');

// GET index page
router.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname + '/../public/html/index.html'));
})

// GET favicon
router.get('/favicon.ico', (req, res, next) => {
  res.sendFile(path.join(__dirname + '/../public/favicon.ico'));
})

// Log id to console
router.post('/getid', (req, res) => {
  console.log(req.body)
  res.send("User id logged")
})

// Register admin user
router.post('/register', (req, res) => {
  let splitCommand = req.body.text.split(' ');
  let pattern = new RegExp(/<@(.*)\|/g);
  
  if (splitCommand[0] === "") {
    res.send("Use \"/register help\" for more info")
  } else if (splitCommand[0] === "help") {
    res.send(command_help.register_help)
  } else if (splitCommand.length == 2 && splitCommand[1] === "admin"){
    let uid = pattern.exec(splitCommand[0]);
    mongoFunctions.registerAdmin(uid[1], res);
  } else {
    res.send("Invalid Command :white_frowning_face:");
  }
})

// Interactivce Components Request URI
router.post('/button', (req, res) => {
  try {
    let payload = JSON.parse(req.body.payload);

    if (payload.hasOwnProperty('actions')) {
      let interactionParams = JSON.parse(payload.actions[0].selected_option.value);
      if (interactionParams.action === "request_get"){
        mongoFunctions.getRequestInfo(interactionParams, payload.response_url);
      } else if (interactionParams.action === "add_models") {
        mongoFunctions.sendDialogue(payload, interactionParams._id);
      }
    }
    
    if (payload.type === "view_submission" && JSON.parse(payload.view.private_metadata).action === "add_models_value") {
      console.log("we made it")
      mongoFunctions.sendModelQuantity(payload);
    }
  } catch (err) {
    console.log(err)
  }
});

// Handle form submits
router.post('/mdrequest', (req, res) => {
  mongoFunctions.sendRequest(req.body)
  request.post(hooks['model-requests'], {
    json: {
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `Model requested by ${req.body.name}`
          }
        },
        {
          type: "divider"
        },
        {
          "type": "section",
          "fields": [
            {
              "type": "plain_text",
              "text": "*this is plain_text text*",
              "emoji": true
            },
            {
              "type": "plain_text",
              "text": "test",
              "emoji": true
            },
            {
              "type": "plain_text",
              "text": "*this is plain_text text*",
              "emoji": true
            }
          ]
        }
      ]
    }
  }, (error, res, body) => {
    if (error) {
      console.error(error)
      return
    }
    console.log(`Model Request Message Sent: ${res.statusCode}`)
  })
  res.render('donate', {name: req.body.name})
})

// Handle /requests user commands
router.post('/requests', (req, res) => {
  let splitCommand = req.body.text.split(' ');
  let uid = req.body.user_id

  if (splitCommand[0] === "") res.send("Use \"/requests help\" for instructions");
  else if (splitCommand[0] === "help") { // Help command
    if (verify_admin(uid)) {
      res.send(command_help['request_help_admin']);
    } else {
      res.send(command_help['request_help_designer']);
    }
  } else if (splitCommand[0] === 'get-current') { // Get current model requests
    if (verify_admin(uid)) {
      mongoFunctions.getOpenRequests(res);
    } else {
      res.send("You do not have permission to use this command.");
    }
  } else if (splitCommand[0] === 'add-printer') { // Add printer to model request
    if (verify_admin(uid)) {

    } else {
      res.send("You do not have permission to use this command.");
    }
  } else if (splitCommand[0] === 'add-designer') { // Add designer to model request
    if (verify_admin(uid)) {

    } else {
      res.send("You do not have permission to use this command.");
    }
  } else { // No command found
    res.send("Command Not Found! Use /requests help for a list of ");
  }
});

// Fulfill get requests for .html files
router.get('/:fname', (req, res, next) => {
  let fname = req.params['fname'];
  res.sendFile(path.join(__dirname + '/../public/html/' + fname));
})

module.exports = router;
