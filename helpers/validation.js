
// import module `check` from `express-validator`
const { check } = require('express-validator');

/*
    defines an object which contains functions
    which returns array of validation middlewares
*/
const validation = {

    /*
        function which returns an array of validation middlewares
        called when the client sends an HTTP POST request for `/signup`
    */
    signupValidation: function () {

        /*
            object `validation` is an array of validation middlewares.
            the first parameter in method check() is the field to check
            the second parameter in method check() is the error message
            to be displayed when the value to the parameter fails
            the validation
        */
        var validation = [

            // checks if `fName` is not empty
            check('user_name', 'Usernames should contain at least 4 characters.').isLength({min: 4}),

            // checks if `pw` contains at least 6 characters
            check('password', 'Passwords should contain at least 4 characters.')
            .isLength({min: 4})
        ];

        return validation;
    }
}

/*
    exports the object `validation` (defined above)
    when another script exports from this file
*/
module.exports = validation;
