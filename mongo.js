var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var url = "mongodb://localhost:27017/";
var model_request = require('./schema.js');

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