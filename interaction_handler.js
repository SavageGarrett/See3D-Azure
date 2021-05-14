var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var url = "mongodb://localhost:27017/";
require('dotenv').config()

var interaction_handler = {

    "blogSubscribe": function(email) {
        MongoClient.connect(url, (err, db) => {
            {useUnifiedTopology: true}
            if (err) console.log("Error connecting to Mongo");
        
            var dbo = db.db("blog")
            dbo.collection("subscriptions").insertOne({ "email": email }, (err, res) => {
                if (err) console.log(`Error subscribing to blog `);
                else console.log("Blog Subscriber Added")
                db.close();
            })
        });
    }
}

module.exports = interaction_handler;