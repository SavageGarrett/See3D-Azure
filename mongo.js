var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var url = "mongodb://localhost:27017/";
var model_request = require('./schema.js');

var mongoFunctions = {
    "sendRequest": function(request_params) {
        model_request['header'] = false;
        model_request['request_params']['date'] = Date.now();
        model_request['request_params']['request_body'] = request_params;

        // Send Model Request Object
        MongoClient.connect(url, function(err, db) {
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
    "getOpenRequests": function(res) {
        // Get open requests
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
        
            var dbo = db.db("model_request")
            let current = dbo.collection("model_requests").find({"request_params.completed": 0}).toArray((err, result) => {
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
                        "value": individual['_id']
                    })
                }
                res.send(payload);
                db.close();
            });
        });
    },
    "getRequestInfo": function() {

    }
    
}

module.exports = mongoFunctions