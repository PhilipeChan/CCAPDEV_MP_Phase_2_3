// import module `mongoose`
var mongoose = require('mongoose');

// defines the schema for collection `users`
var PostSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    profPic: {
        type: String,
        required: true
    },
    title:  {
        type: String,
        required: true
    },
    foodPic: {
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
module.exports = mongoose.model('Post', PostSchema);
