// import module `database` from `../models/db.js`
const db = require('../models/db.js');

const Post = require('../models/PostModel.js');
const path = require('path');
/*
    defines an object which contains functions executed as callback
    when a client requests for `success` paths in the server
*/
const indexController = {

    /*
        executed when the client sends an HTTP GET request `/success`
        as defined in `../routes/routes.js`
    */
    getIndex: async(req, res) => {
        var details = {};

        // checks if a user is logged-in by checking the session data
        if(!req.session.username) {
            res.render('signup');
        }
        
        /*
            sets the value of `details.name` to `req.session.name`
            to display the name of the logged-in user
            in the profile tab of the nav bar

            sets the value of `details.uidNum` to `req.session.idNum`
            to provide the link the profile of the logged-in user
            in the profile tab of the nav bar

            these values are rendered in `../views/partials/header.hbs`
        */
        details.name = req.session.username;
        details.pic = req.session.profPic;

        const posts = await Post.find({});

        res.render('index', {posts, name: details.name, pic: details.pic});
    },

    /*
        executed when the client sends an HTTP POST request `/signup`
        as defined in `../routes/routes.js`
    */
    postCreate: function (req, res) {
        /*
            when submitting forms using HTTP POST method
            the values in the input fields are stored in `req.body` object
            each <input> element is identified using its `name` attribute
            Example: the value entered in <input type="text" name="fName">
            can be retrieved using `req.body.fName`
        */
        var author = req.session.username;
        var profPic = req.session.profPic;
        var title = req.body.postTitle_cr;
        var body = req.body.postBody_cr;

        const {image} = req.files;
        image.mv(path.resolve(__dirname,'../public/images',image.name));

        var post = {
            author: author,
            profPic: profPic,
            title: title,
            foodPic: '/images/'+image.name,
            body: body,
            reputation: 0,
        }

        /*
            calls the function insertOne()
            defined in the `database` object in `../models/db.js`
            this function adds a document to collection `users`
        */
        db.insertOne(Post, post, function(flag) {
            if(flag) {
                /*
                    upon adding a user to the database,
                    redirects the client to `/success` using HTTP GET,
                    defined in `../routes/routes.js`
                    passing values using URL
                    which calls getSuccess() method
                    defined in `./successController.js`
                */
                res.redirect('/index');
            }
        });
    },

    postEdit: function (req, res) {
        /*
            when submitting forms using HTTP POST method
            the values in the input fields are stored in `req.body` object
            each <input> element is identified using its `name` attribute
            Example: the value entered in <input type="text" name="fName">
            can be retrieved using `req.body.fName`
        */
        var title = req.body.postTitle_ed;
        var body = req.body.postBody_ed;
        var postID = req.body.postID;

        const {image} = req.files;
        image.mv(path.resolve(__dirname,'../public/images',image.name));

        var filter = {
            _id: postID
        }

        var update = {
            title: title,
            foodPic: '/images/'+image.name,
            body: body
        }

        /*
            calls the function insertOne()
            defined in the `database` object in `../models/db.js`
            this function adds a document to collection `users`
        */
        db.updateOne(Post, filter, update, function(flag) {
            if(flag) {
                /*
                    upon adding a user to the database,
                    redirects the client to `/success` using HTTP GET,
                    defined in `../routes/routes.js`
                    passing values using URL
                    which calls getSuccess() method
                    defined in `./successController.js`
                */
                res.redirect('back');
            }
        });
    },

    postDelete: function (req, res) {
        /*
            when submitting forms using HTTP POST method
            the values in the input fields are stored in `req.body` object
            each <input> element is identified using its `name` attribute
            Example: the value entered in <input type="text" name="fName">
            can be retrieved using `req.body.fName`
        */
        var postID = req.body.postID;

        var conditions = {
            _id: postID
        }

        /*
            calls the function insertOne()
            defined in the `database` object in `../models/db.js`
            this function adds a document to collection `users`
        */
        db.deleteOne(Post, conditions, function(flag) {
            if(flag) {
                /*
                    upon adding a user to the database,
                    redirects the client to `/success` using HTTP GET,
                    defined in `../routes/routes.js`
                    passing values using URL
                    which calls getSuccess() method
                    defined in `./successController.js`
                */
                res.redirect('back');
            }
        });
    }
}

/*
    exports the object `successController` (defined above)
    when another script exports from this file
*/
module.exports = indexController;
