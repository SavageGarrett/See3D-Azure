var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var ObjectId = require('mongodb').ObjectID
var url = "mongodb://localhost:27017/";
var model_request = require('./schema.js');
const request = require('request');

var mongoFunctions = {
    "sendRequest": function(request_params) {
        model_request['header'] = false;
        model_request['request_params']['date'] = Date.now();
        model_request['request_params']['request_body'] = request_params;

        // Send Model Request Object
        MongoClient.connect(url, function(err, db) {
            {useUnifiedTopology: true}
            if (err) throw err;
        
            var dbo = db.db("model_request")
            dbo.collection("model_requests").insertOne(model_request, (err, res) => {
                if (err) throw err;
                console.log("Model Request Inserted with Id: " + model_request["request_params"]["request_id"]);
                db.close();
            })

            db.close();
        });
    },

    "registerAdmin": function(id, res) {
        MongoClient.connect(url, (err, db) => {
            {useUnifiedTopology: true}
            if (err) throw err;

            var dbo = db.db("roles")
            dbo.collection("users").insertOne({"user_id": id}, (err, res) => {
                if (err) throw err;
                console.log("New Admin User Registered");
            })
        })

        res.send("New admin user created successfully")
    },

    "getOpenRequests": function(res) {
        // Get open requests
        MongoClient.connect(url, (err, db) => {
            if (err) throw err;
        
            var dbo = db.db("model_request")
            dbo.collection("model_requests").find({"request_params.completed": 0}).toArray((err, result) => {
                if (err) throw err;
                let payload = {
                    "blocks": [
                        {
                            "type": "section",
                            "text": {
                                "type": "mrkdwn",
                                "text": "List of model requests"
                            }
                        },
                        {
                            "type": "section",
                            "text": {
                                "type": "mrkdwn",
                                "text": "Pick a model request"
                            },
                            "accessory": {
                                "type": "static_select",
                                "placeholder": {
                                    "type": "plain_text",
                                    "text": "Select an item",
                                    "emoji": true
                                },
                                "options": [
                                ]
                            }
                        }
                    ]
                };

                for (let individual of result) {
                    payload['blocks'][1]['accessory']['options'].push({
                        "text": {
                            "type": "plain_text",
                            "text": individual['request_params']['request_body']['name'],
                            "emoji": true
                        },
                        "value": JSON.stringify({"_id": individual['_id'], "action": "request_get"})
                    })
                }
                res.send(payload);
                db.close();
            });
        });
    },

    "getRequestInfo": function(interactionParams, responseUrl) {
        MongoClient.connect(url, (err, db) => {
            {useUnifiedTopology: true}
            if(err) throw err;
            var dbo = db.db("model_request")
            dbo.collection("model_requests").find(ObjectId(interactionParams._id)).toArray((err, result) => {
                if (err) throw err;
                request.post(responseUrl, {
                    json: {
                    "blocks": [
                        {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": result[0].request_params.request_body.name
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
                            "text": result[0].request_params.request_body.email,
                            "emoji": true
                            }
                        ]
                        },
                        {
                            type: "divider"
                        },
                        {
                            "type": "section",
                            "text": {
                                "type": "plain_text",
                                "text": "User Provided Request Details: " + result[0].request_params.request_body.model_details,
                                "emoji": true
                            }
                        }
                    ]
                    }
                });
            });
        });
    },

    "getShippingInfo": function(payload) {
    }
}

module.exports = mongoFunctions;