#!/bin/bash
echo "Compiling SCSS"
rm public/css/style.css
rm public/css/style.css.map
sass public/scss/style.scss public/css/style.css
echo "SCSS Done Compiling"