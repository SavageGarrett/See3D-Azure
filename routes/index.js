var express = require('express');
var router = express.Router();
const request = require('request');
let interaction_handler = require('../interaction_handler.js');
let chat_message = require('../chat_message.js');
let hooks = require('../secret/hooks.js');
let verify_admin = require('../secret/users.js');
let modal = require('../modal.js')
const token = require('../secret/token.js')
require('dotenv').config()

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
    res.send(chat_message.register_help)
  } else if (splitCommand.length == 2 && splitCommand[1] === "admin"){
    let uid = pattern.exec(splitCommand[0]);
    interaction_handler.registerAdmin(uid[1], res);
  } else {
    res.send("Invalid Command :white_frowning_face:");
  }
})

// Interactivce Components Request URI
router.post('/button', (req, res) => {
  try {
    // Parse payload
    let payload = JSON.parse(req.body.payload);

    // Check for actions property before continuing
    if (payload.hasOwnProperty('actions')) {

      // Payload for chat interactions
      if (payload.type === "block_actions") {
        // Check selected options (debug)
        console.log(payload.actions)

        // Handle Selection Payloads
        if (payload.actions[0].type === "static_select") {
          // Get request data sent with payload
          let interactionParams = JSON.parse(payload.actions[0].selected_option.value);
        
          // Log the action value (debug)
          console.log(interactionParams.action)

          // Do correct action
          if (interactionParams.action === "request_get"){
            interaction_handler.getRequestInfo(interactionParams, payload.response_url);
            res.sendStatus(200);
            console.log("Successfully retrieved request info")
          } else if (interactionParams.action === "add_models") {
            modal.open_modal(interactionParams._id, "add_models", payload, process.env.BOT_TOKEN, modal.model_request_view);
            res.sendStatus(200);
            console.log("Successfully sent add models dialogue");
            chat_message.send_message(hooks["print-request"], chat_message.print_accept);
          } else if (interactionParams.action === "add_design_request") {
            modal.open_modal(interactionParams._id, "add_design_request", payload, process.env.BOT_TOKEN, modal.design_request_view);
            res.sendStatus(200);
            console.log("Successfully sent add design request dialogue");
          }
          // Handle Button Payloads
        } else if (payload.actions[0].type === "button") {
          // Get request data sent with payload
          let interactionParams = JSON.parse(payload.actions[0].value);

          // Handle when someone is adding print responsibility
          if (interactionParams.action === "add_print_responsibility") {
            modal.open_modal(interactionParams._id, "accept_print", payload, process.env.BOT_TOKEN, modal.accept_print);
            res.sendStatus(200);
            console.log("Successfully sent accept print dialogue")
          }
        }
        
      }
    }

    // Payload for modal view submission
    if (payload.type === "view_submission") {
      // Data sent with submission
      let private_metadata = JSON.parse(payload.view.private_metadata);

      // Find which action we're going to do
      if (private_metadata.action === "add_models") {
        // Submit a dialog to add model
        interaction_handler.sendModelQuantity(payload);
        res.send({response_action: "clear"});
        console.log("Successfully stored new models")
      } else if (private_metadata.action === "add_design_request") {
        // Submit a dialog to add design request
        interaction_handler.addDesignRequest(payload);
        res.send({response_action: "clear"});
        console.log("Succesfully stored design request")
      }
    }
  } catch (err) {
    console.log(err)
  }
});

// Handle form submits
router.post('/mdrequest', (req, res) => {
  interaction_handler.sendRequest(req.body)
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
      res.send(chat_message['request_help_admin']);
    } else {
      res.send(chat_message['request_help_designer']);
    }
  } else if (splitCommand[0] === 'get-current') { // Get current model requests
    // Sends user current model request selection
    if (verify_admin(uid)) {
      interaction_handler.getOpenRequests(res);
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

module.exports = router;
