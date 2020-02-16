var express = require('express');
var router = express.Router();
var path = require('path');
const request = require('request');

var admin_users = {

}

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// GET index page
router.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname + '/../public/html/index.html'));
})

router.get('/favicon.ico', (req, res, next) => {
  res.sendFile(path.join(__dirname + '/../public/favicon.ico'));
})

router.post('/getid', (req, res) => {
  console.log(req.body)
  res.send("User id logged")
})

router.post('/test', (req, res) => {
  console.log(req.body)
  res.send({
    "channel": "CTE2Z75RD",
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "Danny Torrence left the following review for your property:"
        }
      },
      {
        "type": "section",
        "block_id": "section567",
        "text": {
          "type": "mrkdwn",
          "text": "<https://google.com|Overlook Hotel> \n :star: \n Doors had too many axe holes, guest in room 237 was far too rowdy, whole place felt stuck in the 1920s."
        },
        "accessory": {
          "type": "image",
          "image_url": "https://is5-ssl.mzstatic.com/image/thumb/Purple3/v4/d3/72/5c/d3725c8f-c642-5d69-1904-aa36e4297885/source/256x256bb.jpg",
          "alt_text": "Haunted hotel image"
        }
      },
      {
        "type": "section",
        "block_id": "section789",
        "fields": [
          {
            "type": "mrkdwn",
            "text": "*Average Rating*\n1.0"
          }
        ]
      }
    ]
  })
})

router.post('/mdrequest', (req, res) => {
  console.log(req.body);
  request.post('https://hooks.slack.com/services/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', {
    json: {
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `Model requested by ${req.body.first_name}`
          }
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
        },
        {
          "type": "divider"
        },
        {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "This is a plain text section block.",
            "emoji": true
          }
        },
        {
          "type": "actions",
          "elements": [
            {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": "Button",
                "emoji": true
              },
              "value": "click_me_123"
            }
          ]
        },
        {
          "type": "context",
          "elements": [
            {
              "type": "mrkdwn",
              "text": "For more info, contact <support@acme.inc>"
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
  
  res.render('donate', {name: req.body['first_name']})
})

router.post('/requests', (req, res) => {
  if (req.body["text"] === "") res.send("Use \"/requests help\" for instructions");
  else if(req.body["text"] === "help") res.send("List of Commands: ");

  let splitCommand = req.body["text"].split(' ');

  if(splitCommand[0] === "assign") {

  } else if (splitCommand[0] === "complete");

  console.log(req.body["text"]);
});

router.get('/:fname', (req, res, next) => {
  let fname = req.params['fname'];
  res.sendFile(path.join(__dirname + '/../public/html/' + fname));
})

module.exports = router;
