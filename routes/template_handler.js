var fs = require('fs')
var path = require('path');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
let ObjectId = require('mongodb').ObjectID;
let api = require('./api')
var url = "mongodb://localhost:27017/";
var axios = require('axios');

// Month array to reference
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

    "index": async (res) => {
        let title = "See3D - 3D Printing for the Blind"

        // Grab News Links from API
        let news_links = []

        // Try to get news links
        // TODO: Load Backup Data on Fail
        try {
            news_links = await api.get_axios_promise({
                method: 'get',
                url: 'https://see3d.org:8080/news-links',
                headers: {
                    'Authorization': `Bearer ${process.env.STRAPI_TOKEN}`
                }
            })

            news_links = news_links.data
        } catch (error) {
            console.log(error)
        }

        res.render('index', {
            title, news_links
        })
    },

    /**
     * Serves gallery pages
     * 
     * @param res response object to send page render
     * @param pagenum the page number to serve
     */
    "gallery": (res, pagenum) => {

        var config = {
            method: 'get',
            url: 'https://see3d.org:8080/galleries',
            headers: {
                'Authorization': `Bearer ${process.env.STRAPI_TOKEN}`
            }
        };

        axios(config)
            .then(function (response) {
                //console.log(response.data) 

                // Loop Through Gallery Data and Add Useful Data
                let gallery_data = [];
                for (let i of response.data) {
                    // Get Available formats
                    let image_formats = {};
                    if (i.hasOwnProperty('image') && i.image.hasOwnProperty('formats')) {
                        image_formats = i.image.formats;
                    }

                    // Get Image Url in order of desired available format
                    let image_url = '';
                    if (image_formats.hasOwnProperty('medium'))
                        image_url = image_formats.medium.url;
                    else if (image_formats.hasOwnProperty('large'))
                        image_url = image_formats.large.url;
                    else if (image_formats.hasOwnProperty('small'))
                        image_url = image_formats.small.url;
                    else if (image_formats !== {})
                        image_url = i.image.url
                    let alt_text = i.alt_text

                    // Update Cleaned Data
                    gallery_data.push({
                        url: `https://see3d.org:8080${image_url}`,
                        alt_text: alt_text
                    })
                }

                // Declare arrays for template output
                let display = [],
                    number_active = [],
                    number = [],
                    arrow_disp = [];
                let plus_arrow, minus_arrow;
                const items_per_page = 12;


                // Serve first page if out of bounds (input validation)
                if (pagenum > Math.ceil(gallery_data.length / items_per_page) || isNaN(pagenum) || pagenum <= 1) {
                    pagenum = 0;
                } else {
                    // Offset page number for array indexing
                    pagenum--;
                }

                let filenames = []
                let arr_alt = []
                // Loop through images on page
                for (let i = 0; i < items_per_page; i++) {
                    // Display image if in valid range by adding to array
                    if (pagenum * items_per_page + i < gallery_data.length) {
                        filenames[i] = gallery_data[pagenum * items_per_page + i].url;
                        arr_alt[i] = gallery_data[pagenum * items_per_page + i].alt_text;
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
                } else if (pagenum == Math.ceil(gallery_data.length / items_per_page)) { // Handle last page
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

                res.render('gallery', {
                    filenames,
                    arr_alt,
                    display,
                    number_active,
                    number,
                    arrow_disp,
                    plus_arrow,
                    minus_arrow
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    // Handles blog pages with their respective queries
    "blog": (res, query) => {
        MongoClient.connect(url, (err, db) => {
            {
                useUnifiedTopology: true
            }
            if (err) {
                console.log("Error Connecting to Database");
                res.redirect('/404')
            } else {
                var dbo = db.db("blog")
                dbo.collection("blog").find({}).sort({
                    date: -1
                }).toArray((err, result) => {
                    if (err) {
                        console.log("Error Fetching Blog Posts from Database");
                        res.redirect('/404');
                    }

                    let display = [],
                        single = false;

                    // Loop through all results from db
                    for (let i = 0; i < result.length; i++) {
                        // Set proper month name to display
                        console.log(result[i].date)
                        var x = new Date(result[i].date)
                        console.log(x)
                        result[i].month = month[x.getMonth()].slice(0, 3)
                        console.log(result[i].month)

                        // Look for articles to include from search query
                        if (query.hasOwnProperty('search') && (result[i].title.toLowerCase().includes(query.search.toLowerCase() || result[i].paragraph.toLowerCase().includes(query.search.toLowerCase()) || result[i].article_description.toLowerCase().includes(query.search.toLowerCase())))) {
                            display.push(result[i]);
                        } else if (query.hasOwnProperty('category') && result[i].toLowerCase()().includes(query.category.toLowerCase()())) {
                            // Look for category in comma separated list of categories if queried (2nd priority)
                            display.push(result[i]);
                        } else if (query.hasOwnProperty('id') && result[i]._id == query.id) {
                            display.push(result[i]);
                            single = true;
                        } else if (!query.hasOwnProperty('search') && !query.hasOwnProperty('category') && !query.hasOwnProperty('id')) {
                            display.push(result[i])
                        }
                    }

                    // If Single Blog Page
                    if (single && (!query.hasOwnProperty('search') && !query.hasOwnProperty('category'))) {
                        // Send Individual post result and the fake tags injected in the text
                        result = display;
                        res.render('blog-single', {
                            result
                        })
                    } else { // Blog Page
                        result = display;
                        res.render('blog', {
                            result
                        })
                    }

                    db.close();
                });
            }
        });
    }
}

module.exports = template_handler;