var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
let ObjectId = require('mongodb').ObjectID;
var url = "mongodb://localhost:27017/";

class Comment {
    constructor(name, email, text, id) {
        this.name = name;
        this.email = email;
        this.text = text;
    }
}

class Like {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }

    store() {
        // Add like to database
        MongoClient.connect(url, (err, db) => {
            {useUnifiedTopology: true}
            if (err) throw err;
        
            var dbo = db.db("blog")
            dbo.collection("blog").insertOne(this ,(err, result) => {
                if (err) throw err;

                console.log(result)
                
                db.close();
            });
        });
    }
}

class Blog_Post {
    /**
     * Instantiate Blog Content Body
     * @param {*} large_title 
     * @param {*} title 
     * @param {*} category 
     * @param {*} paragraph 
     */
    constructor(title, category, paragraph, article_description) {
        this.title = title;
        this.article_description = article_description;
        this.category = category;
        this.paragraph = paragraph;
        this.likes = [];
        this.comments = [];
        this.date = Date.now();
    }

    /**
     * Add like to blog post
     * @param {Like} like like object
     */
    add_like(like) {
        this.likes.push(like)
    }

    /**
     * Add Comment to Blog Post
     * @param {Comment} comment comment object
     */
    add_comment(comment) {
        this.comments.push(comment);
    }

    /**
     * Store blog object to mongodb
     */
    store() {
        // Add blog post to database
        MongoClient.connect(url, (err, db) => {
            {useUnifiedTopology: true}
            if (err) throw err;
        
            var dbo = db.db("blog")
            dbo.collection("blog").insertOne(this ,(err, result) => {
                if (err) throw err;
                
                db.close();
            });
        });
    }
    
}

module.exports = Blog_Post;