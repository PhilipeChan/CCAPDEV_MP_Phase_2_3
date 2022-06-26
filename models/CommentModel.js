
// import module `mongoose`
var mongoose = require('mongoose');

// defines the schema for collection `comments`
var CommentSchema = new mongoose.Schema({
    parentPostID:  {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    profPic: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    reputation: {
        type: Number,
        required: true
    }
});

/*
    exports a mongoose.model object based on `UserSchema` (defined above)
    when another script exports from this file
    This model executes CRUD operations
    to collection `users` -> plural of the argument `User`
*/
module.exports = mongoose.model('Comment', CommentSchema);
