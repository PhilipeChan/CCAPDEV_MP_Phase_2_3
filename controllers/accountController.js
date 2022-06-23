
// import module `database` from `../models/db.js`
const db = require('../models/db.js');

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

        // query where `idNum` is equal to URL parameter `idNum`
        var details = {
            username: req.query.user_name,
            profPic: req.query.image,
            bio: req.query.bio,
            reputation: req.query.reputation
        };

        // render `../views/profile.hbs`
        res.render('account', details);
    }
}

/*
    exports the object `profileController` (defined above)
    when another script exports from this file
*/
module.exports = accountController;
