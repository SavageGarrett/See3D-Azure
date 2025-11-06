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
    },

    "disallowedEmailDomains": [
        'domstat',
        'ssemarketing',
        'advoter',
        'swooflia',
        'buycodeshop',
        'data-backup-store.com',
        'rightbliss.beauty',
        'silesia.life',
        'brasswire.me',
        'example.com'
    ],

    "retrieveBlogSubs": function(res_route) {
        MongoClient.connect(url, (err, db) => {
            {useUnifiedTopology: true}
            if (err) console.log("Error connecting to Mongo");
        
            var dbo = db.db("blog")
            dbo.collection("subscriptions")
                .find({})
                .filter({ email: { $not: { $eq: null } } })
                .toArray((err, result) => {
                if (err)
                {
                    console.log('Error Getting Blog Subscribers')
                    db.close();
                }
                else
                {
                    let filtered_result = result.filter((user) => {
                        if (!user.hasOwnProperty('email')) return false;

                        for (let domain of interaction_handler.disallowedEmailDomains)
                        {
                            if (user.email.includes(domain)) return false;
                        }

                        if (user.email.includes('@')) return true;

                        else return false;
                    });
                    console.log('Successfully retrieved blog subscribers results')

                    let comma_separated = '';
                    for (let entry of filtered_result) {
                        comma_separated += entry.email + ", "
                    }

                    res_route.send(comma_separated);
                    db.close();
                }
            });
        });
    }
}

module.exports = interaction_handler;