var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
let ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/';
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
      {
        true;
      }
      if (err) throw err;

      var dbo = db.db('blog');
      dbo.collection('blog').insertOne(this, (err, result) => {
        if (err) {
          console.log('Error Inserting Blog');
        } else {
          // Save image as objectid name
          fs.renameSync(
            image.image_input.path,
            path.join(
              __dirname,
              `../../public/img/blog_posts/${result.insertedId}.jpg`
            ),
            (err) => {
              if (err) console.log('Error Saving Image');
            }
          );

          res.redirect(`/blog.html?id=${result.insertedId}`);

          db.close();
        }
      });
    });
  }
}

module.exports = Blog_Post;
