
// import module `bcrypt`
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

            /*
                redirects the client to `/profile` using HTTP GET,
                defined in `../routes/routes.js`
                passing values using URL
                which calls getProfile() method
                defined in `./profileController.js`
            */
            res.redirect('/account/' + req.session.username);
        }
        // else if a user is not yet logged-in
        else {
            // render `../views/signup.hbs`
            res.render('login');
        }
    },

    /*
        executed when the client sends an HTTP POST request `/login`
        as defined in `../routes/routes.js`
    */
    postLogIn: function (req, res) {

        /*
            when submitting forms using HTTP POST method
            the values in the input fields are stored in `req.body` object
            each <input> element is identified using its `name` attribute
            Example: the value entered in <input type="text" name="idNum">
            can be retrieved using `req.body.idNum`
        */
        var uname = req.body.user_name;
        var pw = req.body.password;

        /*
            calls the function findOne()
            defined in the `database` object in `../models/db.js`
            this function finds a document from collection `users`
            where `idNum` is equal to `idNum`
        */
        db.findOne(User, {username: uname}, '', function (result) {

            // if a user with `idNum` equal to `idNum` exists
            if(result) {

                var user = {
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
                        /*
                            stores `user.idNum` to `req.session.idNum`
                            stores `user.fName` to `req.session.name`

                            these values are stored to the `req.session` object
                            to indicate that a user is logged-in
                            these values will be removed
                            if the user logs-out from the web application
                        */
                            req.session.username = user.username;
                            req.session.profPic = user.profPic;
                            req.session.bio = user.bio;
                            req.session.reputation = user.reputation;

                        /*
                            redirects the client to `/profile/idNum`
                            where `idNum` is equal
                            to the `idNum` entered by the user
                            defined in `../routes/routes.js`
                            which calls getProfile() method
                            defined in `./profileController.js`
                        */
                        res.redirect('/account/' + user.username);
                    }
                    /*
                        else if the entered password
                        does not match the hashed password from the database
                    */
                    else {
                        var details = {error_login: `Username and/or Password
                            is incorrect.`}

                        /*
                            render `../views/login.hbs`
                            display the errors
                        */
                        res.render('login', details);
                    }
                });
            }

            // else if a user with `idNum` equal to `idNum` does not exist
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

/*
    exports the object `loginController` (defined above)
    when another script exports from this file
*/
module.exports = loginController;
