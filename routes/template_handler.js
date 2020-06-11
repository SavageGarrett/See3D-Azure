var fs = require('fs')
var path = require('path');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
let ObjectId = require('mongodb').ObjectID;
var url = "mongodb://localhost:27017/";

var month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";

let template_handler = {
    /**
     * Serves gallery pages
     * 
     * @param res response object to send page render
     * @param pagenum the page number to server
     */
    "gallery": (res, pagenum) => {
        // Read in names of images
        let filenames = fs.readdirSync(path.join(__dirname, '../public/new_site/img/gallery/'));

        // Declare arrays for template output
        let display = [], number_active = [], number = [], arrow_disp = [];
        let plus_arrow, minus_arrow;


        // Serve first page if out of bounds (input validation)
        if (pagenum > Math.ceil(filenames.length / 10) || isNaN(pagenum) || pagenum <= 1) {
            pagenum = 0;
        } else {
            // Offset page number for array indexing
            pagenum--;
        }

        // Loop through images on page
        for (let i = 0; i < 10; i++) {
            // Display image if in valid range by adding to array
            if (pagenum * 10 + i < filenames.length) {
                filenames[i] = filenames[pagenum * 10 + i];
                display.push('block');
            } else {
                filenames[i] = undefined;
                display.push('none');
            }
        }

        // Reset page number to true page number
        pagenum++;

        // Serve pagination via arrays (ignores edge cases of 3 or less pages)
        if (pagenum == 1) { // Handle first page
            number = [pagenum, pagenum + 1, pagenum + 2];
            number_active = ['active', '', ''];
            arrow_disp = ['none', 'block'] // Sets display property for left/right arrow
            plus_arrow = 2;
            minus_arrow = 1;
        } else if (pagenum == Math.ceil(filenames.length / 10)) { // Handle last page
            number = [pagenum - 2, pagenum - 1, pagenum];
            number_active = ['', '', 'active'];
            arrow_disp = ['block', 'none']
            plus_arrow = 0;
            minus_arrow = pagenum - 1;
            console.log(minus_arrow)
        } else { // Handle any other page
            number = [pagenum - 1, pagenum, pagenum + 1];
            number_active = ['', 'active', ''];
            arrow_disp = ['block', 'block'];
            plus_arrow = pagenum + 1;
            minus_arrow = pagenum - 1;
        }

        res.render('gallery', {filenames, display, number_active, number, arrow_disp, plus_arrow, minus_arrow});        
    },

    // Handles blog pages with their respective queries
    "blog": (res, query) => {
        MongoClient.connect(url, (err, db) => {
            {useUnifiedTopology: true}
            if (err) throw err;
        
            var dbo = db.db("blog")
            dbo.collection("blog").find({}).sort({date: -1}).toArray((err, result) => {
                if (err) throw err;
                
                let display = [], single = false;

                // Loop through all results from db
                for (let i = 0; i < result.length; i++) {
                    // Set proper month name to display
                    result[i].month = month[new Date(result[i].date).getMonth()]
                    if (result[i].month.length > 3) {
                        result[i].month = result[i].month.slice(result[i].month.length - 4, result[i].month.length - 1)
                    }

                    // Look for articles to include from search query
                    if (query.hasOwnProperty('search') && (result[i].title.includes(query.search) 
                        || result[i].paragraph.includes(query.search) 
                        || result[i].article_description.includes(query.search))) {
                        display.push(result[i]);
                    } else if (query.hasOwnProperty('category') && result[i].toLowerCase().includes(query.category.toLowerCase())) {
                        // Look for category in comma separated list of categories if queried (2nd priority)
                        display.push(result[i]);
                    } else if (query.hasOwnProperty('id') && result[i]._id == query.id) {
                        display.push(result[i]);
                        single = true;
                    }
                }

                if (single) {
                    res.render('blog-single', {result})
                } else if (query) {
                    res.render('blog', {result})
                }

                db.close();
            });
        });
    }
}

module.exports = template_handler;