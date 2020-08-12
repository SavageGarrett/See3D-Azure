#!/bin/sh

#Rename to .pug. with correct info
for file in *; do 
    if [ -f "$file" ]; then 
        sed 's/.jade/.pug/g' $file > $file.
    fi 
done

#Rename back to .pug
rename -f 's/\.pug.$/.pug/' **