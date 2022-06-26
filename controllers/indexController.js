const db = require('../models/db.js');

const User = require('../models/UserModel.js');
const Post = require('../models/PostModel.js');
const Comment = require('../models/CommentModel.js');
const path = require('path');

const indexController = {

    getIndex: async(req, res) => {
        var details = {};

        // checks if a user is logged-in by checking the session data
        if(!req.session.username) {
            res.render('signup');
        }
        
        details.name = req.session.username;
        details.pic = req.session.profPic;
        details.accountID = req.session._id;

        const posts = await Post.find({});
        const comments = await Comment.find({});

        res.render('index', {comments, posts, name: details.name, pic: details.pic, accountID: details.accountID, search: ""});
    },


    postCreate: function (req, res) {
    
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

        db.insertOne(Post, post, function(flag) {
            if(flag) {
                res.redirect('/index');
            }
        });
    },

    postEdit: function (req, res) {
        
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
        
        db.updateOne(Post, filter, update, function(flag) {
            if(flag) {
                
                res.redirect('back');
            }
        });
    },

    postDelete: function (req, res) {
        
        var postID = req.body.postID;

        var conditions = {
            _id: postID
        }

        db.deleteOne(Post, conditions, function(flag) {
            if(flag) {
                db.updateOne(User, {username: req.session.username}, {$inc: { reputation: req.body.postRep * -1 }}, function(flag) {
                    if (flag) {
                        db.deleteMany(Comment, {parentPostID: conditions._id}, function(flag) {
                            if (flag) {
                                res.redirect('back');
                            }
                        });
                    }
                });
            }
        });
    },

    postCommentCreate: function (req, res) {
        
        var author = req.session.username;
        var profPic = req.session.profPic;
        var body = req.body.commentBody;
        var parentPostID = req.body.parentPostID;

        var comment = {
            parentPostID: parentPostID,
            author: author,
            profPic: profPic,
            body: body,
            reputation: 0,
        }

        db.insertOne(Comment, comment, function(flag) {
            if(flag) {
                res.redirect('back');
            }
        });
    },

    postCommentEdit: function (req, res) {
        
        var body = req.body.commentBody;
        var commentID = req.body.commentID;

        var filter = {
            _id: commentID
        }

        var update = {
            body: body
        }

        db.updateOne(Comment, filter, update, function(flag) {
            if(flag) {
                
                res.redirect('back');
            }
        });
    },

    postCommentDelete: function (req, res) {
        
        var commentID = req.body.commentID;

        var conditions = {
            _id: commentID
        }

        db.deleteOne(Comment, conditions, function(flag) {
            if(flag) {
                db.updateOne(User, {username: req.session.username}, {$inc: { reputation: req.body.commentRep * -1 }}, function(flag) {
                    if (flag) {
                        res.redirect('back');
                    }
                });
            }
        });
    },

    getUpRep: function (req, res) {
        var id = req.query.id;
        var type = req.query.type;
        var author = req.query.author;

        var filter1 = {
            _id: id
        }

        var filter2 =  {
            username: author
        }

        if (type == "post") {
            db.updateOne(Post, filter1, {$inc: { reputation: 1 }}, function(flag) {
                if(flag) {
                    db.updateOne(User, filter2, {$inc: { reputation: 1 }}, function(flag) {
                        if(flag) {
                            res.redirect('back');
                        }
                    });
                }
            });
        }

        else {
            db.updateOne(Comment, filter1, {$inc: { reputation: 1 }}, function(flag) {
                if(flag) {
                    db.updateOne(User, filter2, {$inc: { reputation: 1 }}, function(flag) {
                        if(flag) {
                            res.redirect('back');
                        }
                    });
                }
            });
        }
    },

    getDownRep: function (req, res) {
        var id = req.query.id;
        var type = req.query.type;
        var author = req.query.author;

        var filter1 = {
            _id: id
        }

        var filter2 =  {
            username: author
        }

        if (type == "post") {
            db.updateOne(Post, filter1, {$inc: { reputation: -1 }}, function(flag) {
                if(flag) {
                    db.updateOne(User, filter2, {$inc: { reputation: -1 }}, function(flag) {
                        if(flag) {
                            res.redirect('back');
                        }
                    });
                }
            });
        }

        else {
            db.updateOne(Comment, filter1, {$inc: { reputation: -1 }}, function(flag) {
                if(flag) {
                    db.updateOne(User, filter2, {$inc: { reputation: -1 }}, function(flag) {
                        if(flag) {
                            res.redirect('back');
                        }
                    });
                }
            });
        }
    },

    postSearch: async(req, res) => {
        var details = {};

        // checks if a user is logged-in by checking the session data
        if(!req.session.username) {
            res.render('signup');
        }
        
        details.name = req.session.username;
        details.pic = req.session.profPic;

        const posts = await Post.find({});
        const comments = await Comment.find({});

        res.render('index', {comments, posts, name: details.name, pic: details.pic, search: req.body.searchInput});
    }
}

module.exports = indexController;
