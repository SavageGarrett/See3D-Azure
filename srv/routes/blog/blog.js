var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
let ObjectId = require('mongodb').ObjectID;
require('dotenv').config()
var url = `mongodb://db:${process.env.MONGO_PORT || 27017}/`;
const fs = require('fs');
let path = require('path');

class Blog_Post {
    /**
     * Instantiate Blog Content Body
     * @param {*} large_title 
     * @param {*} title 
     * @param {*} category 
     * @param {*} paragraph 
     */
    constructor(title, category, paragraph, article_description, alt_text) {
        this.title = title;
        this.article_description = article_description;
        this.category = category;
        this.paragraph = paragraph;
        this.alt_text = alt_text;
        this.likes = [];
        this.comments = [];
        this.date = Date.now();
        this.id;
    }

    /**
     * Store blog object to mongodb
     */
    store(res, image) {
        // Add blog post to database
        MongoClient.connect(url, (err, db) => {
            {useUnifiedTopology: true}
            if (err) throw err;
        
            var dbo = db.db("blog")
            dbo.collection("blog").insertOne(this, (err, result) => {
                if (err) throw err;

                // Save image as objectid name
                fs.renameSync(image.image_input.path, path.join(__dirname, `../../public/new_site/img/blog_posts/${result.insertedId}.jpg`), (err) => {
                    if (err) throw err
                })
                
                res.redirect(`/blog.html?id=${result.insertedId}`)

                db.close();
            });
        });
    }
}

module.exports = Blog_Post;