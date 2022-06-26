const bcrypt = require('bcrypt');
const saltRounds = 10;

const db = require('../models/db.js');

const User = require('../models/UserModel.js');
const Post = require('../models/PostModel.js');
const Comment = require('../models/CommentModel.js');
const path = require('path');

const accountController = {

    getAccount: function (req, res) {

        // checks if a user is logged-in by checking the session data
        if(!req.session.username) {
            res.render('signup');
        }
        
        // query where 'username' is equal to URL parameter 'username'
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
                render the account page with their details
            */
            if(result != null) {
                details.username = result.username;
                details.profPic = result.profPic;
                details.bio = result.bio;
                details.reputation = result.reputation;
                details.name = req.session.username;
                details.pic = req.session.profPic;
                details.accountID = req.session._id;

                // load all posts and comments
                const posts = await Post.find({});
                const comments = await Comment.find({});

                res.render('account', {comments, posts, name: details.name, pic: details.pic, username: details.username,
                    profPic: details.profPic, bio: details.bio, reputation: details.reputation, accountID: details.accountID, search: ""});
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
    },

    postAccountEdit: function (req, res) {
        db.findOne(User, {username: req.session.username}, '', function (result) {
            if (result) {
                bcrypt.compare(req.body.currPass, result.pw, function(err, equal) {
                    if (equal) {
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

                            var update = {
                                username: user_name,
                                pw: hash,
                                profPic: '/images/'+image.name,
                                bio: bio
                            }
                            
                            var filter = {
                                username: req.body.oldName
                            }

                            db.updateOne(User, filter, update, function(flag) {
                                if(flag) {
                                    
                                    // stores user info in session
                                    req.session.username = update.username;
                                    req.session.profPic = update.profPic;
                                    req.session.bio = update.bio;
                                    req.session.reputation = update.reputation;

                                    db.updateMany(Post, {author: filter.username}, {author: update.username, profPic: update.profPic}, function(flag) {
                                        if (flag)
                                            db.updateMany(Comment, {author: filter.username}, {author: update.username, profPic: update.profPic}, function(flag) {
                                                if (flag)
                                                    res.redirect('/account/' + update.username);
                                        });
                                    });
                                }
                            });
                        });
                    }
                    else {
                        console.log("Wrong Current Password");
                        res.redirect('/account/' + req.session.username);
                    }
                });
            }
        });
    },

    postAccountDelete: function (req, res) {
        db.findOne(User, {username: req.session.username}, '', function (result) {
            if (result) {
                bcrypt.compare(req.body.currPass, result.pw, function(err, equal) {
                    if (equal) {

                        var username_del = req.body.username_del ;

                        var conditions = {
                            username: username_del
                        }

                        db.deleteOne(User, conditions, function(flag) {
                            if(flag) {
                                db.findMany(Post, {author: username_del}, '_id', function(result) {
                                    if (result) {
                                        result.forEach(function(item) {
                                            db.deleteMany(Comment, {parentPostID: item._id}, function() {});
                                        });

                                        db.deleteMany(Post, {author: username_del}, function(flag) {
                                            if(flag) {
                                                db.deleteMany(Comment, {author: username_del}, function(flag) {
                                                    if(flag) {
                                                        req.session.destroy(function(err) {
                                                            if(err) throw err;
        
                                                            res.redirect('/');
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                    else {
                        console.log("Wrong Current Password");
                        res.redirect('/account/' + req.session.username);
                    }
                });
            }
        });
    }
}

module.exports = accountController;
