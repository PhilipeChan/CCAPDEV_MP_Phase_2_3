// import module `mongoose`
var mongoose = require('mongoose');

// defines the schema for collection `posts`
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

module.exports = mongoose.model('Post', PostSchema);
