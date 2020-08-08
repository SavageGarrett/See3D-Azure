var fs = require('fs')
var path = require('path');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
let ObjectId = require('mongodb').ObjectID;
var url = "mongodb://localhost:27017/";

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

// Alt text of 94 images with their respective alt text
let alt_text = {
    "Alligator 1.jpg": "Alligator 3D model",
    "Brainstem 1.jpg": "Brainstem with Braille",
    "Butterfly Chrysalis.jpg": "Butterfly Chrysalis 3D Print",
    "Butterfly Life Cycle.jpg": "Stages of Butterfly lifecycle 3D Print",
    "CABVI Logo 2.jpg": "3D Logo raised of CABVI",
    "COVID 2.jpg": "3D model of COVID-19",
    "Cassandra Castle Brighter.jpg": "Cinderella Castle 3D model",
    "Caterpillar Articulated 3.jpg": "Caterpillar 3D Print",
    "Caterpillar Half 1.jpg": "Caterpillar 3D Print",
    "Caterpillar Half 2.jpg": "Caterpillar 3D Print",
    "Chicken Footprint.jpg": "Chicken Footprint imprint 3D Print",
    "Chinese Dragon.jpg": "Chinese Dragon 3D Print",
    "Chloroplast.jpg": "Chloroplast 3D Print",
    "Chromosomes 4.jpg": "Chromosomes 3D Print",
    "Constellation Centaurus.jpg": "Constellation Centaurus 3D Print",
    "Constellation Dome.jpg": "Constellations on a dome",
    "Curiosity Rover.jpg": "Curiosity Rover 3D Print",
    "DDI I-44 and MO-13 #2.jpg": "Double Diamond Intersection imprint",
    "DNA Green.jpg": "DNA 3D Print",
    "DSCF1742.jpg": "Castle 3D Print",
    "DSCF1743.jpg": "Castle 3D Print",
    "DSCF1754.jpg": "Brain 3D Print",
    "DSCF1790.jpg": "Biology 3D Print",
    "DSCF1794.jpg": "Cell Imprint 3D Print",
    "DSCF1806.jpg": "Ohio State Stadium 3D Print",
    "DSCF1815.jpg": "Office floorplan 3D print ",
    "Dodecahedron.jpg": "Dodecahedron 3D print",
    "EFEA1D04-BD01-4551-A6D1-1B6E12624170.jpg": "Various Maps 3D print",
    "Eye Model Cropped.jpg": "Eye 3D print",
    "Fish in Anemone.jpg": "Fish in Anemone 3D print",
    "IMG_1047_Facetune_14-05-2020-12-06-21.jpg": "Train 3D Print",
    "IMG_1210.jpg": "Topographical USA 3D Print",
    "IMG_1212.jpg": "US Capitol 3D Print",
    "IMG_1466_Facetune_08-06-2020-18-18-52.jpg": "Galaxy 3D Print",
    "IMG_1469.jpg": "Moon Topography 3D Print",
    "JWST.jpg": "Sattelite 3D Print",
    "K-9 Garrett 2.jpg": "K9 Robot Dog 3D Print",
    "Klein Bottle Photo.jpg": "Klein Bottle 3D Print",
    "Lighthouse.jpg": "Lighthouse 3D Print",
    "MakerX Brailler.jpg": "MakerX Brailler",
    "MakerX Models.jpg": "MakerX 3D Models",
    "MakerX Table 2.jpg": "MakerX Table ",
    "Milky Way Side 5.jpg": "Milky Way Side 3D Print",
    "Mt. Vesuvius.jpg": "Mt. Vesuvius 3D Print",
    "Orlando International Airport.jpg": "Orlando International Airport 3D Print",
    "Party Models.jpg": "Party Models 3D Print",
    "Planets.jpg": "Planets 3D Print",
    "Platonic Shapes.jpg": "Platonic Shapes 3D Print",
    "Protein Yellow Bigger.jpg": "Protein 3D Print",
    "Roof 1.jpg": "Roof 3D Print",
    "Roof 6.jpg": "Roof 3D Print",
    "Rose Model Full.jpg": "Rose 3D Print",
    "Rose Model Top.jpg": "Rose 3D Print",
    "Rose.jpg": "Rose 3D Print",
    "Rosen Shingle Creek Hotel big site of 2018 Convention.jpg": "Rosen Shingle Creek Hotel 3D Print",
    "Sea Creatures Blue Seahorse Fish Frog Whaleshark Toad.jpg": "Sea Creature 3D Prints",
    "See3D banner.jpg": "See3D Banner",
    "Snowman Crater.jpg": "Snowman Crater 3D Print",
    "Statue of Liberty 2.jpg": "Statue of Liberty 3D Print",
    "TEDx 4.png": "Caroline TEDx Talk",
    "TEDx far 1.png": "Caroline TEDx Talk",
    "Taj Mahal.jpg": "Taj Mahal 3D Print",
    "Tesseract.jpg": "Tesseract 3D Print",
    "USA Flag Model.jpg": "US Flag 3D Print",
    "USA Precipitation Map.jpg": "US Precipitation Map 3D Print",
    "USA Topographical blue 2.jpg": "US Topographical 3D Print",
    "USA Topographical.jpg": "US Topographical 3D Print",
    "UT Tower.jpg": "UT Tower 3D Print",
    "Water Drop 2.jpg": "Water Drop 3D Print",
    "butterfly eggs on leaf.jpg": "Monarch Eggs on Leaf 3D Print",
    "butterfly monarch egg.jpg": "Monarch Egg 3D Print",
    "iPhone Jamie 1.jpg": "iPhone 3D Print",
    "iPhone Jamie updated volume.jpg": "iPhone 3D Print"
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
                    result[i].month = result[i].month.slice(0, 3)

                    // Look for articles to include from search query
                    if (query.hasOwnProperty('search') && (result[i].title.includes(query.search) || result[i].paragraph.includes(query.search) || result[i].article_description.includes(query.search))) {
                        display.push(result[i]);
                    } else if (query.hasOwnProperty('category') && result[i].toLowerCase().includes(query.category.toLowerCase())) {
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
                    // Create Split Version of Paragraph, list of links, an array to store the text contained in posts
                    let new_paragraph = result[0].paragraph.split(/\<link\>.+\<\/link\>/), links = [], post_body_text = [];
                    
                    // Create array to store whether each section of text is a link or a regular blog of text

                    // Remove all links and add to array
                    while (result[0].paragraph.includes('<link>')) {
                        let match_data = result[0].paragraph.match(/\<link\>.+\<\/link\>/);
                        links.push(result[0].paragraph.substr(match_data.index, match_data[0].length));
                        result[0].paragraph = result[0].paragraph.replace(/\<link\>.+\<\/link\>/, '');
                    }

                    // Sanitize Links
                    for (let i = 0; i < links.length; i++) {
                        links[i] = links[i].replace('<link>', '');
                        links[i] = links[i].replace('</link>', '');
                    }

                    // Add to array in order
                    for (let j = 0; j < new_paragraph.length; j++) {
                        post_body_text.push({paragraph: new_paragraph[j]});

                        if (j in links) {
                            post_body_text.push({link: links[j]});
                        }
                    }

                    // Send Individual post result and the fake tags injected in the text
                    result = display;
                    res.render('blog-single', {result, post_body_text})
                } else { // Blog Page
                    result = display;
                    res.render('blog', {result})
                }

                db.close();
            });
        });
    }
}

module.exports = template_handler;