const bcrypt = require('bcrypt');

// import module `database` from `../models/db.js`
const db = require('../models/db.js');

// import module `User` from `../models/UserModel.js`
const User = require('../models/UserModel.js');

/*
    defines an object which contains functions executed as callback
    when a client requests for `login` paths in the server
*/
const loginController = {

    /*
        executed when the client sends an HTTP GET request `/login`
        as defined in `../routes/routes.js`
    */
    getLogIn: function (req, res) {
        // checks if a user is logged-in by checking the session data
        if(req.session.username) {
            res.redirect('/index/');
        }
        // else if a user is not yet logged-in
        else {
            res.render('login');
        }
    },

    /*
        executed when the client sends an HTTP POST request `/login`
        as defined in `../routes/routes.js`
    */
    postLogIn: function (req, res) {

        var uname = req.body.user_name;
        var pw = req.body.password;

        /*
            calls the function findOne()
            defined in the `database` object in `../models/db.js`
            this function finds a document from collection `users`
            where `username` is equal to `username`
        */
        db.findOne(User, {username: uname}, '', function (result) {

            // if a user with `username` equal to `username` exists
            if(result) {

                var user = {
                    _id: result._id,
                    username: result.username,
                    profPic: result.profPic,
                    bio: result.bio,
                    reputation: result.reputation
                };
                
                /*
                    use compare() method of module `bcrypt`
                    to check if the password entered by the user
                    is equal to the hashed password in the database
                */
                bcrypt.compare(pw, result.pw, function(err, equal) {

                    /*
                        if the entered password
                        match the hashed password from the database
                    */
                    if(equal) {
                        // stores user data in session
                        req.session.username = user.username;
                        req.session.profPic = user.profPic;
                        req.session.bio = user.bio;
                        req.session.reputation = user.reputation;
                        req.session._id = user._id;

                        res.redirect('/index/');
                    }
                    /*
                        else if the entered password
                        does not match the hashed password from the database
                    */
                    else {
                        var details = {error_login: `Username and/or Password
                            is incorrect.`}

                        res.render('login', details);
                    }
                });
            }

            // else if a user with 'username' equal to `username` does not exist
            else {
                var details = {error_login: `Username and/or Password is
                    incorrect.`}

                /*
                    render `../views/login.hbs`
                    display the errors
                */
                res.render('login', details);
            }
        });
    }
}

module.exports = loginController;
