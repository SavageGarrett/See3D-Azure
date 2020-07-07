var express = require('express');
var router = express.Router();
const request = require('request');
let interaction_handler = require('../interaction_handler.js');
let chat_message = require('../chat_message.js');
let hooks = require('../secret/hooks.js');
let verify_admin = require('../secret/users.js');
let modal = require('../modal.js');
require('dotenv').config();
var path = require('path');
let template_handler = require('./template_handler.js');
let Blog_Post = require('./blog/blog.js')
const formidable = require('formidable');
const fs = require('fs');
const { blogSubscribe } = require('../interaction_handler.js');
const { query } = require('express');

/*
 * Start Slack Bot Routes
 */

// Log id to console
router.post('/getid', (req, res) => {
  console.log(req.body)
  res.send("User id logged")
});

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
});

// Interactivce Components Request URI
router.post('/button', (req, res) => {
  try {
    // Parse payload
    let payload = JSON.parse(req.body.payload);
    console.log(payload)

    // Check for actions property before continuing
    if (payload.hasOwnProperty('actions')) {

      // Payload for chat interactions
      if (payload.type === "block_actions") {
        // Check selected options (debug)
        //console.log(payload.actions)

        // Handle Selection Payloads
        if (payload.actions[0].type === "static_select") {
          // Get request data sent with payload
          let interactionParams = JSON.parse(payload.actions[0].selected_option.value);
        
          // Log the action value (debug)
          //console.log(interactionParams.action)
          // Do correct action
          if (interactionParams.action === "request_get"){
            interaction_handler.getRequestInfo(interactionParams, payload.response_url);
            res.sendStatus(200);
            console.log("Successfully retrieved request info")
          } else if (interactionParams.action === "add_models") {
            modal.open_modal(JSON.stringify({_id: interactionParams._id, action: "add_models"}), payload, process.env.BOT_TOKEN, modal.model_request_view);
            res.sendStatus(200);
            console.log("Successfully sent add models dialogue");
            chat_message.send_message(hooks["print-request"], chat_message.print_accept);
          } else if (interactionParams.action === "add_design_request") {
            modal.open_modal(JSON.stringify({_id: interactionParams._id, action: "add_design_request"}), payload, process.env.BOT_TOKEN, modal.design_request_view);
            res.sendStatus(200);
            console.log("Successfully sent add design request dialogue");
          } else if (interactionParams.action === "more_info") {
            interaction_handler.sendMoreInfo(interactionParams, payload.response_url);
            res.sendStatus(200)
          } else if (interactionParams.action === "mark_complete") {
            interaction_handler.markComplete(interactionParams, payload.response_url);
            res.sendStatus(200);
          }

          // Handle Button Payloads
        } else if (payload.actions[0].type === "button") {
          // Get request data sent with payload
          let interactionParams = JSON.parse(payload.actions[0].value);

          // Handle when someone is adding print responsibility
          console.log(interactionParams.total_quantity)
          if (interactionParams.action === "add_print_responsibility") {
            modal.open_modal(JSON.stringify({_id: interactionParams._id, action: "accept_print", total_quantity: interactionParams.total_quantity}), payload, process.env.BOT_TOKEN, modal.accept_print);
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
      if (private_metadata.action === "add_models") { // Submit Add Models
        // Submit a dialog to add model
        interaction_handler.sendModelQuantity(payload);
        res.send({response_action: "clear"});
        console.log("Successfully stored new models")
      } else if (private_metadata.action === "accept_print") { // Submit Accept Number of Models
        let response_action = interaction_handler.acceptPrint(payload, private_metadata);

        // Error When Invalid Number
        if (response_action === "errNotNan") {
          // Update View
          //console.log(payload)
          res.send({
            "response_action": "errors",
            "errors": {
              "num-models-input": `You must enter a number less than or equal to ${private_metadata.total_quantity}`
            }
          })
          console.log("Invalid View Error Sent to User")

        // Correct Number
        } else if (response_action === "clear") {
          // Save to Database and Update Print Chat Message Quantity

          // Clear Modal Stack
          res.send({response_action: "clear"});
          console.log("Successfully Updated Print Quantity In Database")

        // Error
        } else {
          console.log("Unknown Response")
        }
      } else if (private_metadata.action === "add_design_request") { // Submit Add Design Request
        // Submit a dialog to add design request
        interaction_handler.addDesignRequest(payload);

        // Handle Add Design Request (Send message to chat then follow up with direct message)

        console.log("Succesfully stored design request")
      } 
    }
  } catch (err) {
    console.log(err)
  }
});

// Handle form submits
router.post('/mdrequest', (req, res) => {
  console.log(req.body);
  interaction_handler.sendRequest(req.body)
  request.post(hooks['model-requests'], {
    json: {
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `Model requested by ${req.body.first_name} ${req.body.last_name}`
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
              "text": `Email: ${req.body.email}`,
              "emoji": true
            },
            {
              "type": "plain_text",
              "text": ` `,
              "emoji": true
            },
            {
              "type": "plain_text",
              "text": `Details: ${req.body.stl_file || req.body.model_details}`,
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
});

// Handle /requests user commands
router.post('/requests', (req, res) => {
  let splitCommand = req.body.text.split(' ');
  let uid = req.body.user_id

  if (splitCommand[0] === "") { 
    interaction_handler.getOpenRequests(res);
  } 

  // Commented out to temporarily simplify
  //else if (splitCommand[0] === "help") { // Help command
  //   if (verify_admin(uid)) {
  //     res.send(chat_message['request_help_admin']);
  //   } else {
  //     res.send(chat_message['request_help_designer']);
  //   }
  // } else if (splitCommand[0] === 'get-current') { // Get current model requests
  //   // Sends user current model request selection
  //   if (verify_admin(uid)) {
  //     interaction_handler.getOpenRequests(res);
  //   } else {
  //     res.send("You do not have permission to use this command.");
  //   }
  // } else if (splitCommand[0] === 'add-printer') { // Add printer to model request
  //   if (verify_admin(uid)) {

  //   } else {
  //     res.send("You do not have permission to use this command.");
  //   }
  // } else if (splitCommand[0] === 'add-designer') { // Add designer to model request
  //   if (verify_admin(uid)) {

  //   } else {
  //     res.send("You do not have permission to use this command.");
  //   }
  // } else { // No command found
  //   res.send("Command Not Found! Use /requests help for a list of commands.");
  // }
});

/*
 * End Slack Bot Routes
 */

/*
 * Begin Web Routes
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

// Serve Page Routes
router.get('/:fname', (req, res, next) => {
  // Get File Name from Request Parameters
  let fname_split = req.params.fname.split('.');
  let fname = req.params.fname;

  // If Query is Defined Create Query
  if (req.query !== void 0) {
    var query = req.query
  }


  // Serve Testimony Page If Query Exists and fname is correct
  if (query.testimony !== void 0 && fname_split[0] === "index") {
    res.render('testimony', { query });
  }


  // Check no extension or html extension or php extension
  if (fname_split[1] === void 0 || fname_split[1] === "html" || fname_split[1] === "php" || fname_split[1] === "ico") {
    // Serve Pages Based on Their Name
    switch (fname_split[0]) {
      case "favicon":
        res.sendFile(path.join(__dirname, "../public/favicon.ico"));
        break;
      case "index":
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
        res.render('contact');
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
        res.render('request');
        break;
      default:
        res.sendFile(path.join(__dirname, `../public/new_site/html/${fname}`));
        break;
    }
  } else { // Else forward request to error
    next()
  }
});

// Route php requests that had directory on old server to index
router.get('/:dirname/:fname', (req, res, next) => {
  let fname = req.params.fname;
  if (fname.includes('.php')) {
    res.redirect('/')
  } else {
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

// Serve Resume Files
router.get('/resume/:name', (req, res, next) => {
  let name = req.params.name;
  res.sendFile(path.join(__dirname, `/../public/new_site/resume/${name}`));
})

// Post Blog form
router.post('/post_blog', (req, res) => {
  // Validate Username and Password

  // Parse out form separating files and fields
  new formidable.IncomingForm().parse(req, (err, fields, files) => {
    if (err) { // Catch and handle error
      console.log(err);
      throw err;
    }

    // Create new object to store blog post information
    let blog_post = new Blog_Post(fields.article_title, fields.categories, fields.paragraph, fields.article_description, fields.alt_text);

    // Store blog post and files
    blog_post.store(res, files);
  });
});

// Post Contact Form
router.post('/contact_process', (req, res) => {
  new formidable.IncomingForm().parse(req, (err, fields, files) => {
    if (err) throw err;

    console.log(fields)
  });
});

/*
 * End Web Routes
 */

module.exports = router;
