const PORT = process.env.PORT || 3000;
// import module `express`
const express = require('express');

// import module `hbs`
const hbs = require('hbs');

// import module `express-session`
const session = require('express-session');

// import module `mongoose`
const mongoose = require('mongoose');

// import module `connect-mongo`
const MongoStore = require('connect-mongo');

// import module `routes` from `./routes/routes.js`
const routes = require('./routes/routes.js');

// import module `database` from `./model/db.js`
const db = require('./models/db.js');

const app = express();

require('dotenv').config();

// set `hbs` as view engine
app.set('view engine', 'hbs');
app.set("port", PORT);

// sets `/views/partials` as folder containing partial hbs files
hbs.registerPartials(__dirname + '/views/partials');

require('./helpers/handlebars')(hbs);

// parses incoming requests with urlencoded payloads
app.use(express.urlencoded({extended: true}));

// set the folder `public` as folder containing static assets
// such as css, js, and image files
app.use(express.static('public'));

// connects to the database
db.connect();

// use `express-session`` middleware and set its options
// use `MongoStore` as server-side session storage
app.use(session({
    'secret': 'ccapdev-mp-2-3-session',
    'resave': false,
    'saveUninitialized': false,
    store: new MongoStore({
        mongoUrl: mongoose.connection._connectionString,
        mongoOptions: {}
      })
}));

// define the paths contained in `./routes/routes.js`
app.use('/', routes);

// if the route is not defined in the server, render `../views/error.hbs`
// always define this as the last middleware
app.use(function (req, res) {
    res.render('error');
});

// binds the server to a specific port
app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
