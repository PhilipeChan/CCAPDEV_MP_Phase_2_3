
// import module `database` from `../models/db.js`
const db = require('../models/db.js');

const Post = require('../models/PostModel.js');
// import module `User` from `../models/UserModel.js`
const User = require('../models/UserModel.js');

/*
    defines an object which contains functions executed as callback
    when a client requests for `profile` paths in the server
*/
const accountController = {

    /*
        executed when the client sends an HTTP GET request `/profile/:idNum`
        as defined in `../routes/routes.js`
    */
    getAccount: function (req, res) {

        // checks if a user is logged-in by checking the session data
        if(!req.session.username) {
            res.render('signup');
        }
        
        // query where `idNum` is equal to URL parameter `idNum`
        var query = {username: req.params.username};

        // fields to be returned
        var projection = 'username profPic bio reputation';

        var details = {};

        /*
            calls the function findOne()
            defined in the `database` object in `../models/db.js`
            this function searches the collection `users`
            based on the value set in object `query`
            the third parameter is a string containing fields to be returned
            the fourth parameter is a callback function
            this called when the database returns a value
            saved in variable `result`
        */
        db.findOne(User, query, projection, async(result) => {

            /*
                if the user exists in the database
                render the profile page with their details
            */
            if(result != null) {
                details.username = result.username;
                details.profPic = result.profPic;
                details.bio = result.bio;
                details.reputation = result.reputation;
                details.name = req.session.username;
                details.pic = req.session.profPic;
                
                // render `../views/profile.hbs`
                const posts = await Post.find({});
                res.render('account', {posts, name: details.name, pic: details.pic, username: details.username,
                    profPic: details.profPic, bio: details.bio, reputation: details.reputation});
            }
            /*
                if the user does not exist in the database
                render the error page
            */
            else {
                // render `../views/error.hbs`
                res.render('error');
            }
        });
    }
}

/*
    exports the object `profileController` (defined above)
    when another script exports from this file
*/
module.exports = accountController;
