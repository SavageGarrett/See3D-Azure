#!/bin/bash
echo "Compiling SCSS"
rm public/new_site/css/style.css
rm public/new_site/css/style.css.map
sass public/new_site/scss/style.scss public/new_site/css/style.css
echo "SCSS Done Compiling"