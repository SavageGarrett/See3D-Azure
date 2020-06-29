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

let alt_text = {
    "Alligator 1.jpg": "Alligator 3D model",
    "Brainstem 1.jpg": "Brainstem with Braille",
    "Butterfly Chrysalis.jpg": "Butterfly Chrysalis 3D Print",
    "Butterfly Life Cycle.jpg": "Stages of Butterfly lifecycle 3D Print",
    "CABVI Logo 2.jpg": "3D Logo raised of CABVI",
    "COVID 2.jpg": "3D model of COVID-19",
    "Cassandra Castle Brighter.jpg": "a",
    "Caterpillar Articulated 3.jpg": "s",
    "Caterpillar Half 1.jpg": "d",
    "Caterpillar Half 2.jpg": "f",
    "Chicken Footprint.jpg": "g",
    "Chinese Dragon.jpg": "h",
    "Chloroplast.jpg": "j",
    "Chromosomes 4.jpg": "k",
    "Constellation Centaurus.jpg": "l",
    "Constellation Dome.jpg": ";",
    "Curiosity Rover.jpg": "q",
    "DDI I-44 and MO-13 #2.jpg": "w",
    "DNA Green.jpg": "e",
    "DSCF1742.jpg": "r",
    "DSCF1743.jpg": "",
    "DSCF1754.jpg": "",
    "DSCF1790.jpg": "",
    "DSCF1794.jpg": "",
    "DSCF1806.jpg": "",
    "DSCF1815.jpg": "",
    "Dodecahedron.jpg": "",
    "EFEA1D04-BD01-4551-A6D1-1B6E12624170.jpg": "",
    "Eye Model Cropped.jpg": "",
    "Fish in Anemone.jpg": "",
    "IMG_1047_Facetune_14-05-2020-12-06-21.jpg": "",
    "IMG_1210.jpg": "",
    "IMG_1212.jpg": "",
    "IMG_1466_Facetune_08-06-2020-18-18-52.jpg": "",
    "IMG_1469.jpg": "",
    "JWST.jpg": "",
    "K-9 Garrett 2.jpg": "",
    "Klein Bottle Photo.jpg": "",
    "Lighthouse.jpg": "",
    "MakerX Brailler.jpg": "",
    "MakerX Models.jpg": "",
    "MakerX Table 2.jpg": "",
    "Milky Way Side 5.jpg": "",
    "Mt. Vesuvius.jpg": "",
    "Orlando International Airport.jpg": "",
    "Party Models.jpg": "",
    "Planets.jpg": "",
    "Platonic Shapes.jpg": "",
    "Protein Yellow Bigger.jpg": "",
    "Roof 1.jpg": "",
    "Roof 6.jpg": "",
    "Rose Model Full.jpg": "",
    "Rose Model Top.jpg": "",
    "Rose.jpg": "",
    "Rosen Shingle Creek Hotel big site of 2018 Convention.jpg": "",
    "Sea Creatures Blue Seahorse Fish Frog Whaleshark Toad.jpg": "",
    "See3D banner.jpg": "",
    "Snowman Crater.jpg": "",
    "Statue of Liberty 2.jpg": "",
    "TEDx 4.png": "",
    "TEDx far 1.png": "",
    "Taj Mahal.jpg": "",
    "Tesseract.jpg": "",
    "USA Flag Model.jpg": "",
    "USA Precipitation Map.jpg": "",
    "USA Topographical blue 2.jpg": "",
    "USA Topographical.jpg": "",
    "UT Tower.jpg": "",
    "Water Drop 2.jpg": "",
    "butterfly eggs on leaf.jpg": "",
    "butterfly monarch egg.jpg": "",
    "iPhone Jamie 1.jpg": "",
    "iPhone Jamie updated volume.jpg": ""
}

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

        // Add alt text to images
        let arr_alt = [];
        for (let j = 0; j < filenames.length; j++) {
            if (alt_text.hasOwnProperty(filenames[j])) {
                arr_alt.push(alt_text[filenames[j]]);
            } else {
                arr_alt.push("");
            }
        }

        res.render('gallery', {filenames, arr_alt, display, number_active, number, arrow_disp, plus_arrow, minus_arrow});        
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
                    // let new_paragraph = result[0].paragraph.split(/\<link\>.+\<\/link\>/), links = [], final = [];

                    // // Remove all links and add to array
                    // while (result[0].paragraph.includes('<link>')) {
                    //     let match_data = result[0].paragraph.match(/\<link\>.+\<\/link\>/);
                    //     links.push(result[0].paragraph.substr(match_data.index, match_data[0].length));
                    //     result[0].paragraph = result[0].paragraph.replace(/\<link\>.+\<\/link\>/, '');
                    // }

                    // // Sanitize Links
                    // for (let i = 0; i < links.length; i++) {
                    //     links[i] = links[i].replace('<link>', '');
                    //     links[i] = links[i].replace('</link>', '');
                    // }

                    // // Add to array in order
                    // for (let j = 0; j < new_paragraph.length; j++) {
                    //     final.push({paragraph: new_paragraph[j]});

                    //     if (j in links) {
                    //         final.push({link: links[j]});
                    //     }
                    // }

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