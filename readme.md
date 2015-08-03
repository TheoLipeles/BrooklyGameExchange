Brooklyn Game Exchange is an online marketplace for indie videogames.

Joe's notes on environment:
development environment, when something is running on your machine
use monglab in production;


var DATABASE_URI = require(path.join(__dirname, '../env')).DATABASE_URI;

connects DB to the correct URI

echo $NODE_ENV
export NODE_ENV

bash variable ($)

in fsg, if the node environment is development
the production secret, keys, tokens...reside on the host computer, they can be set in $bash in the computer
heroku (an abstraction on top of AWS)


heroku congif:set NODE_ENV=production
heroku config:set SESSION_SECRETE=lobsterthoughts
heroku addons: add mongolab
web: node server/start.js
