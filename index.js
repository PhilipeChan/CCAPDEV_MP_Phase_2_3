/*****************
 * 
 * To use mongoose and connect to the database
 * + schema model
 * + Create an instance of the schema model
 * + Insert it into the database via mongoose connection
 */

const express = require('express');
const app = new express();

/***************** Where we will use mongoose */
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/galleryDB', // Connect to our MongoDB database
{useNewURLParser: true, useUnifiedTopology: true}); // Create database connection

// For File Uploads
const fileUpload = require('express-fileupload');

// Post initializations. 1, the schema model, the path directory for file uploads, and a static resource folder //
const Post = require("./database/models/Post");
const path = require('path'); // Local path directory for our static resource folder

// Initialize data and static folder that our app will use
app.use(express.json()); // Use JSON throughout our app for parsing
app.use(express.urlencoded( {extended: true})); // Information consists of more than just strings
app.use(express.static('public')); // static directory name, meaning that the application will also refer to a folder named 'public'.
// placed all the images in 'public' folder
app.use(fileUpload()); // for fileuploading

/* using handlebars */
var hbs = require('hbs');
app.set('view engine','hbs');

// This is for posting the photos in our local directory public/images
app.post('/submit-post', function(req, res) { // /submit-post came from index.html form action
    const {image} = req.files
    image.mv(path.resolve(__dirname,'public/images',image.name),(error) => {
        Post.create({
            ...req.body,
            image:'/images/'+image.name
        }, (error,post) => {
            res.redirect('/')
        })
    })
});

// This is the localhost:3000/content for viewing all posts
app.get('/content', async(req,res) => { // Async since there are many inputs
    const posts = await Post.find({}) // Perform MongoDB query inside {} and store results into posts
    res.render('content',{posts})
})

app.get('/', function(req, res) {
    res.sendFile(__dirname + '\\' + 'index.html');
});

var server = app.listen(3000, function() {
    console.log("Node server is running at port 3000....");
});