var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
let ObjectId = require('mongodb').ObjectID;
var url = "mongodb://localhost:27017/";
var model_request = require('./schema.js');
var request = require('request');
let hooks = require('./secret/hooks.js');
const token = require('./secret/token.js')

var mongoFunctions = {
    /**
     * Send request posted from website to mongo
     * 
     * @param {*} request_params 
     */
    sendRequest: function(request_params) {
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

    /**
     * Register admin users
     * 
     * @param {*} id 
     * @param {*} res 
     */
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

    /**
     * Gets incomplete requests and spits them out into a message
     * 
     * @param res response object provided by express
     */
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

    /**
     * Send options once model request is selected
     * 
     * @param {*} interactionParams 
     * @param {*} responseUrl 
     */
    "getRequestInfo": function(interactionParams, responseUrl) {
        MongoClient.connect(url, (err, db) => {
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
                        }, {
                            "type": "section",
                            "text": {
                                "type": "mrkdwn",
                                "text": "Pick an action"
                            },
                            "accessory": {
                                "type": "static_select",
                                "placeholder": {
                                    "type": "plain_text",
                                    "text": "Select an item",
                                    "emoji": true
                                },
                                "options": [
                                    {
                                        "text": {
                                            "type": "plain_text",
                                            "text": "Add Models",
                                            "emoji": true
                                        },
                                        "value": JSON.stringify({"_id": interactionParams._id, "action": "add_models"})
                                    },
                                    {
                                        "text": {
                                            "type": "plain_text",
                                            "text": "Add Design Request",
                                            "emoji": true
                                        },
                                        "value": JSON.stringify({"_id": interactionParams._id, "action": "add_design_request"})
                                    }
                                ]
                            }
                        }
                    ]
                    }
                });
            });
        });
    },

    /*
     * Send thingiverse link and model quantity
     * to mongo db object
     * 
     * @param payload
     */
    "sendModelQuantity": function(payload) {
        // Link and quantity variables
        let link, qty;

        // Loop through input values
        for (let s in payload.view.state.values) {
            if (payload.view.state.values[s].hasOwnProperty('link_input')) {
                link = payload.view.state.values[s].link_input.value; // Set thingiverse link value
            } else {
                qty = payload.view.state.values[s].qty_input.value; // Set 
            }
        }

        // Verify Input Values
        if (typeof link !== undefined || typeof qty !== undefined || !isNaN(qty)) {
            MongoClient.connect(url, {
                useUnifiedTopology: true
            },(err, db) => { 
                if(err) throw err;

                // Create Database object
                var dbo = db.db("model_request")

                // Retrieved from private_metadata 
                let id = JSON.parse(payload.view.private_metadata)._id;
                dbo.collection("model_requests").updateOne({"_id": new ObjectId(id)},
                {
                    $push: {
                        "request_state.modelsWanted.availableModels": {
                            model_link: link,
                            model_count: qty,
                            completed: 0
                        }
                    }
                },
                {upsert: true}).then((res) => {
                    if (res.modifiedCount != 1) {
                        console.log(`Error: ${res.modifiedCount} database entries edited`)
                    }
                }).catch((err) => {
                    console.log(err)
                })
            });
        }
    },

    /**
     * Open design request view
     * 
     * @param {*} payload 
     */
    "addDesignRequest": function(payload) {

    },

    /**
     * Get model shipping info
     * 
     * @param {*} payload 
     */
    "getShippingInfo": function(payload) {
    }
}

module.exports = mongoFunctions;