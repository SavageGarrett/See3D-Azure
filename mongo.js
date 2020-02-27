var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
let ObjectId = require('mongodb').ObjectID;
var url = "mongodb://localhost:27017/";
var model_request = require('./schema.js');
var axios = require('axios');
var request = require('request');
let hooks = require('./secret/hooks.js');
const token = require('./secret/token.js')

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
                                    }//,
                                    // {
                                    //     "text": {
                                    //         "type": "plain_text",
                                    //         "text": "Add Designer",
                                    //         "emoji": true
                                    //     },
                                    //     "value": "value-1"
                                    // },
                                    // {
                                    //     "text": {
                                    //         "type": "plain_text",
                                    //         "text": "Add Printer",
                                    //         "emoji": true
                                    //     },
                                    //     "value": "value-2"
                                    // },
                                    // {
                                    //     "text": {
                                    //         "type": "plain_text",
                                    //         "text": "Get Shipping Info",
                                    //         "emoji": true
                                    //     },
                                    //     "value": "value-3"
                                    // }
                                ]
                            }
                        }
                    ]
                    }
                });
            });
        });
    },


    "sendDialogue": function(payload, id) {
        axios.post("https://slack.com/api/views.open",
        {
            "trigger_id": payload.trigger_id,
            "view": {
                "private_metadata": JSON.stringify({_id: id, action: "add_models_value"}),
                "type": "modal",
                "title": {
                    "type": "plain_text",
                    "text": "Add Models ",
                    "emoji": true
                },
                "submit": {
                    "type": "plain_text",
                    "text": "Submit",
                    "emoji": true
                },
                "close": {
                    "type": "plain_text",
                    "text": "Cancel",
                    "emoji": true
                },
                "blocks": [
                    {
                        "type": "input",
                        "element": {
                            "type": "plain_text_input",
                            "action_id": "link_input",
                            "placeholder": {
                                "type": "plain_text",
                                "text": "Thingiverse model link"
                            }
                        },
                        "label": {
                            "type": "plain_text",
                            "text": "Model"
                        }//,
                        // "hint": {
                        //     "type": "plain_text",
                        //     "text": "Hint text"
                        // }
                    },
                    {
                        "type": "input",
                        "element": {
                            "type": "plain_text_input",
                            "action_id": "qty_input",
                            "placeholder": {
                                "type": "plain_text",
                                "text": "Number of Models"
                            }
                        },
                        "label": {
                            "type": "plain_text",
                            "text": "Quantity"
                        }//, 
                        // "hint": {
                        //     "type": "plain_text",
                        //     "text": "Hint text"
                        // }
                    }
                ]
            }
        },
        {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
        .then((res) => {
            console.log(res)
        })
        .catch((err) => {
            //console.log(err)
        })
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
            MongoClient.connect(url, (err, db) => {
                if(err) throw err;

                // Create Database object
                var dbo = db.db("model_request")

                // Retrieved from private_metadata 
                console.log(JSON.parse(payload.view.private_metadata)._id)
                dbo.collection("model_requests").updateOne({"_id": ObjectID(JSON.parse(payload.view.private_metadata)._id)},
                {
                    $push: {
                        request_state: {
                            modelsWanted: {
                                available: [{
                                    // Corresponding Array Indices
                                    model_links: [link],
                                    model_count: [qty]
                                }]
                            }
                        }
                    }
                }).then((res) => {
                    console.log(res)
                })
            });
        }
    },

    "getShippingInfo": function(payload) {
    }
}

module.exports = mongoFunctions;