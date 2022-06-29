// import module `validationResult` from `express-validator`
const { validationResult } = require('express-validator');

// import module `bcrypt`
const bcrypt = require('bcrypt');
const saltRounds = 10;

// import module `database` from `../models/db.js`
const db = require('../models/db.js');

// import module `User` from `../models/UserModel.js`
const User = require('../models/UserModel.js');
const path = require('path');
/*
    defines an object which contains functions executed as callback
    when a client requests for `signup` paths in the server
*/
const signupController = {

    /*
        executed when the client sends an HTTP GET request `/signup`
        as defined in `../routes/routes.js`
    */
    getSignUp: function (req, res) {
        // checks if a user is logged-in by checking the session data
        if(req.session.username) {
            res.redirect('/index/');
        }
        // else if a user is not yet logged-in
        else {
            // render `../views/signup.hbs`
            res.render('signup');
        }
    },

    /*
        executed when the client sends an HTTP POST request `/signup`
        as defined in `../routes/routes.js`
    */
    postSignUp: function (req, res) {
        // checks if there are validation errors
        var errors = validationResult(req);

        // if there are validation errors
        if (!errors.isEmpty()) {

            // get the array of errors
            errors = errors.errors;

            /*
                for each error, store the error inside the object `details`
                the field is equal to the parameter + `Error`
                the value is equal to `msg`
                as defined in the validation middlewares
            */
            var details = {};
            for(i = 0; i < errors.length; i++)
                details[errors[i].param + 'Error'] = errors[i].msg;

            /*
                render `../views/signup.hbs`
                display the errors defined in the object `details`
            */
            res.render('signup', details);
        }

        else {
            /*
                when submitting forms using HTTP POST method
                the values in the input fields are stored in `req.body` object
                each <input> element is identified using its `name` attribute
                Example: the value entered in <input type="text" name="user_name">
                can be retrieved using `req.body.user_name`
            */
            var user_name = req.body.user_name;
            var bio = req.body.bio;
            var password = req.body.password;

            const {image} = req.files;
            image.mv(path.resolve(__dirname,'../public/images',image.name));

            /*
                use hash() method of module `bcrypt`
                to hash the password entered by the user
                the hashed password is stored in variable `hash`
                in the callback function
            */
            bcrypt.hash(password, saltRounds, function(err, hash) {

                var user = {
                    username: user_name,
                    pw: hash,
                    profPic: '/images/'+image.name,
                    bio: bio,
                    reputation: 0
                }

                /*
                    calls the function insertOne()
                    defined in the `database` object in `../models/db.js`
                    this function adds a document to collection `users`
                */
                db.insertOne(User, user, function(flag) {
                    if(flag) {
                        
                        // store user data in session
                        req.session.username = user.username;
                        req.session.profPic = user.profPic;
                        req.session.bio = user.bio;
                        req.session.reputation = user.reputation;
                        db.findOne(User, {username: user.username}, '', function(result) {
                            if(result) {
                                req.session._id = result._id;
                            }
                        });

                        res.redirect('/index/');
                    }
                });
            });
        }
    },

    /*
        executed when the client sends an HTTP GET request `/getCheckUsername`
        as defined in `../routes/routes.js`
    */
    getCheckUsername: function (req, res) {

        /*
            when passing values using HTTP GET method
            the values are stored in `req.query` object
            Example url: `http://localhost/getCheckID?username=John`
            To retrieve the value of parameter `username`: `req.query.username`
        */
        var username = req.query.username;

        /*
            calls the function findOne()
            defined in the `database` object in `../models/db.js`
            searches for a single document based on the model `User`
            sends an empty string to the user if there are no match
            otherwise, sends an object containing the `username`
        */
        db.findOne(User, {username: username}, 'username', function (result) {
            res.send(result);
        });
    }
}

/*
    exports the object `signupController` (defined above)
    when another script exports from this file
*/
module.exports = signupController;
