var fs = require('fs')
var path = require('path');

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
    }
}

module.exports = template_handler;