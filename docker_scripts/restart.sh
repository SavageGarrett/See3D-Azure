#!/bin/sh

# Move to Base Project Directory
cd ..

# restart services in docker-compose
docker-compose stop $@
docker-compose rm -f -v $@
docker-compose create --force-recreate $@
docker-compose start $@
