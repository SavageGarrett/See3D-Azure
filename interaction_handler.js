var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
let ObjectId = require('mongodb').ObjectID;
var url = "mongodb://localhost:27017/";
var model_request = require('./model_request.js');
var request = require('request');
var axios = require('axios');
require('dotenv').config()
const fs = require('fs')
var path = require('path')

var interaction_handler = {
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
            {useUnifiedTopology: true}
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
                            "text": individual['request_params']['request_body']['name'] || individual['request_params']['request_body']['usr'],
                            "emoji": true
                        },
                        "value": JSON.stringify({"_id": individual['_id'], "action": "request_get"})
                    })
                }
                fs.writeFileSync(path.join(__dirname, "blocks.json"), JSON.stringify(payload))
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
        console.log(responseUrl)
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
                            "text": result[0].request_params.request_body.name || result[0].request_params.request_body.usr
                        }
                        },
                        {
                        "type": "divider"
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
                            "type": "divider"
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
                                            "text": "More Info",
                                            "emoji": true
                                        },
                                        "value": JSON.stringify({"_id": interactionParams._id, "action": "more_info"})
                                    },
                                    {
                                        "text": {
                                            "type": "plain_text",
                                            "text": "Mark Complete",
                                            "emoji": true
                                        },
                                        "value": JSON.stringify({"_id": interactionParams._id, "action": "mark_complete"})
                                    }
                                    // Temporarily Simplify
                                    // {
                                    //     "text": {
                                    //         "type": "plain_text",
                                    //         "text": "Add Models",
                                    //         "emoji": true
                                    //     },
                                    //     "value": JSON.stringify({"_id": interactionParams._id, "action": "add_models"})
                                    // },
                                    // {
                                    //     "text": {
                                    //         "type": "plain_text",
                                    //         "text": "Add Design Request",
                                    //         "emoji": true
                                    //     },
                                    //     "value": JSON.stringify({"_id": interactionParams._id, "action": "add_design_request"})
                                    // }
                                ]
                            }
                        }
                    ]
                    }
                }, (err, httpResponse, body) => {
                    if (err) console.log(err)
                    console.log(result[0].request_params.request_body)
                    //console.log(httpResponse)

                    //console.log(body)
                })
            });
        });
    },

    "sendMoreInfo": function(payload, res_url) {
        MongoClient.connect(url, (err, db) => {
            if (err) throw err;

            // Declare Db object
            var dbo = db.db("model_request")

            dbo.collection("model_requests").find(ObjectId(payload._id)).toArray((err, result) => {
                console.log(result[0].request_params)
                params = result[0].request_params.request_body;

                // Update Braille Label Yes/No
                if (params.braille_label === "on") {
                    params.braille_label = "Yes";
                } else {
                    params.braille_label = "No";
                }

                request.post(res_url,{
                    json: {
                        "blocks": [
                            {
                                "type": "section",
                                "text": {
                                    "type": "mrkdwn",
                                    "text": "More Info"
                                }
                            },
                            {
                                "type": "divider"
                            },
                            {
                                "type": "section",
                                "text": {
                                    "type": "mrkdwn",
                                    "text": `Address: ${params.address}\nCity: ${params.city}\nState: ${params.state}\nBraille Label: ${params.braille_label}\nUnderstand Better: ${params.understand}`
                                }
                            },
                            {
                                "type": "divider"
                            }
                        ]
                    }
                });
            });
        })
    },

    "markComplete": function(payload, res_url) {
        MongoClient.connect(url, (err, db) => {
            if (err) throw err;

            // Declare Db object
            var dbo = db.db("model_request")
            
            dbo.collection("model_requests").updateOne({"_id": new ObjectId(payload._id)}, {$set: {"request_params.completed": 1}})
                .then((res) => {
                    if (res.modifiedCount != 1) {
                        console.log(`Error: ${res.modifiedCount} database entries edited`)
                    }
                })
                .catch((err) => {
                    console.log(err)
                })

            axios.post(res_url, {
                json: {
                    "blocks": [
                        {
                            "type": "section",
                            "text": {
                                "type": "mrkdwn",
                                "text": "Request Completed"
                            }
                        }
                    ]
                }
            })
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
            MongoClient.connect(url, {
                useUnifiedTopology: true
            },(err, db) => { 
                if(err) throw err;

                // Create Database object
                var dbo = db.db("model_request")

                // Create id for models to be printed
                let sub_id = ObjectId();

                // Retrieved from private_metadata 
                let id = JSON.parse(payload.view.private_metadata)._id;
                dbo.collection("model_requests").updateOne({"_id": new ObjectId(id)},
                    {
                        $push: {
                            "request_state.modelsWanted.availableModels": {
                                id: sub_id,
                                model_link: link,
                                model_count: qty,
                                assigned_users: [], //TODO
                                completed: 0
                            }
                        }
                    },
                    {upsert: true}).then((res) => {
                        if (res.modifiedCount != 1) {
                            console.log(`Error: ${res.modifiedCount} database entries edited`)
                        } else {
                            // Send message to print-requests channel
                            this.sendPrintMessage(sub_id, link, qty)
                        }
                    }).catch((err) => {
                        console.log(err)
                    })

            });
        }
    },

    "sendPrintMessage": function(id, link, qty) {
        // Send message to printers
        axios.post(process.env.PRINT_REQUESTS_CHANNEL, {
            json: {
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": `New Print Request\nModel: ${link}\nQuantity: ${qty}`
                        }
                    },
                    {
                        "type": "actions",
                        "elements": [
                            {
                                "type": "button",
                                "text": {
                                    "type": "plain_text",
                                    "emoji": true,
                                    "text": "Print"
                                },
                                "style": "primary",
                                "value": JSON.stringify({_id: id, action: "add_print_responsibility", total_quantity: qty})
                            }
                        ]
                    }
                ]
            }
        });
    },

    "acceptPrint": function(payload, private_metadata) {
        let values = payload.view.state.values;
        let v1 = values[Object.keys(values)[0]];
        let v2 = v1[Object.keys(v1)[0]];
        let numPrint = v2.value;
        let quantity = private_metadata.total_quantity;

        //console.log(quantity)
        //console.log(numPrint)

        if (isNaN(numPrint) || numPrint < 0 || numPrint > quantity) {
            // Return not nan error
            return "errNotNan";
        }

        axios.post("https://slack.com/api/chat.postMessage",
        {
            channel: payload.user.id,
            username: "See3D Bot",
            blocks: [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `You have accepted to print ${numPrint} Models.`
                    }
                },
                {
                    "type": "section",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": "*File:*\n<google.com|Download>"
                        },
                        {
                            "type": "mrkdwn",
                            "text": "*When:*\nSubmitted Aut 10"
                        }
                    ]
                },
                {
                    "type": "actions",
                    "elements": [
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "emoji": true,
                                "text": "Done"
                            },
                            "style": "primary",
                            "value": "accepted_done"
                        },
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "emoji": true,
                                "text": "Cancel"
                            },
                            "style": "danger",
                            "value": "accepted_cancel"
                        }
                    ]
                }
            ]
        },
        {
            headers: {
                "Authorization": "Bearer " + process.env.BOT_TOKEN
            }
        })
        .then((res) => {
            //console.log(res)
        })
        .catch((err) => {
            console.log(err)
        })

        // Log to database TODO
        MongoClient.connect(url, (err, db) => {
            {useUnifiedTopology: true}
            if (err) throw err;
        
            var dbo = db.db("model_request")
            dbo.collection("model_requests").find({"request_params.completed": 0}).toArray((err, result) => {
                if (err) throw err;
                


                db.close();
            });
        });


        return "clear"
    },
}

module.exports = interaction_handler;