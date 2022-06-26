$(document).ready(function () {
    /*
        Function which returns true if all the fields are not empty.
        Otherwise, this function returns false.
        This trims leading and trailing blank spaces
        then checks if the values are not empty.
    */
    function isFilled() {

        /*
            gets the value of a specific field in the signup form
            then removes leading and trailing blank spaces
        */
        var uname = validator.trim($('#name_ed').val());
        var pass = validator.trim($('#password_ed').val());

        /*
            checks if the trimmed values in fields are not empty
        */
        var unameEmpty = validator.isEmpty(uname);
        var passEmpty = validator.isEmpty(pass);

        return !passEmpty && !unameEmpty;
    }

    
    function isValidUsername(field, callback) {

        /*
            gets the value of `name_ed` in the signup form
            removes leading and trailing blank spaces
            then checks if it contains at least 4 characters
        */
        var uname = validator.trim($('#name_ed').val());
        var isValidLength = validator.isLength(uname, {min: 4});

        // if at least 4 chars
        if(isValidLength) {
            /*
                send an HTTP GET request using JQuery AJAX
                the first parameter is the path in our server
                which is defined in `../../routes/routes.js`
                the server will execute the function getCheckUsername()
                defined in `../../controllers/signupController.js`
                the second parameter passes the variable `uname`
                as the value of the field `username` to the server
                the last parameter executes a callback function
                when the server sent a response
            */
            $.get('/getCheckUsername', {username: uname}, function (result) {

                // if the value of `uname` does not exists in the database
                if(result.username != uname) {

                    /*
                        check if the <input> field calling this function
                        is the `name_ed` <input> field
                    */
                    if(field.is($('#name_ed')))
                        // remove the error message in `unameEditError`
                        $('#unameEditError').text('');

                    /*
                        since  the value of `name_ed` contains at least 4 chars
                        and is not yet used by another user in the database
                        return true.
                    */
                    return callback(true);

                }

                // else if the value of `name_ed` exists in the database
                else {

                    /*
                        check if the <input> field calling this function
                        is the `name_ed` <input> field
                    */
                    if(field.is($('#name_ed')))
                        // display appropriate error message in `unameEditError`
                        $('#unameEditError').text('Username number already registered.');

                    /*
                        since the value of `name_ed`
                        is used by another user in the database
                        return false.
                    */
                    return callback(false);
                }
            });
        }

        // else if the value of `name_ed` is less than 4 chars
        else {

            /*
                check if the <input> field calling this function
                is the `name_ed` <input> field
            */
            if(field.is($('#name_ed')))
                // display appropriate error message in `unameEditError`
                $('#unameEditError').text('Username should contain 4 characters.');

            /*
                since the value of `name_ed` is less than 4 chars
                return false.
            */
            return callback(false);
        }
    }

    function isValidPassword(field) {

        // sets initial value of return variable to false
        var validPassword = false;

        /*
            gets the value of `pw` in the signup form
            removes leading and trailing blank spaces
            then checks if it contains at least 8 characters.
        */
        var password = validator.trim($('#password_ed').val());
        var isValidLength = validator.isLength(password, {min: 4});

        // if the value of `pw` contains at least 4 characters
        if(isValidLength) {

            /*
                check if the <input> field calling this function
                is the `pw` <input> field
            */
            if(field.is($('#password_ed')))
                // remove the error message in `passEditError`
                $('#passEditError').text('');

            /*
                since  the value of `pw` contains at least 4 characters
                set the value of the return variable to true.
            */
            validPassword = true;
        }

        // else if the value of `pw` contains less than 4 characters
        else {

            /*
                check if the <input> field calling this function
                is the `pw` <input> field
            */
            if(field.is($('#password_ed')))
                // display appropriate error message in `passEditError`
                $('#passEditError').text(`Passwords should contain at least 4
                    characters.`);
        }

        // return value of return variable
        return validPassword;
    }

    /*
        Function which checks if the `field` is empty.
        This also calls functions isFilled(), isValidPassword(), and
        isValidUsername().
        This is attached to the `keyup` event of each field
        in the signup form.
        This activates the `submit` button if:
        - value returned by function isFilled() is true
        - value returned by function isValidPassword() is true
        - value returned by function isValidUsername() is true

        The function has 3 parameters:
        - field - refers to the current <input> field calling this function
        - fieldName - the `placeholder` of the current <input> field calling
        this function
        - error - the corresponding <p> element to display the error of the
        current <input> field calling this function
    */
    function validateField(field, fieldName, error) {

        /*
            gets the value of `field` in the signup form
            removes leading and trailing blank spaces
            then checks if the trimmed value is empty.
        */
        var value = validator.trim(field.val());
        var empty = validator.isEmpty(value);

        // if the value of `field` is empty
        if(empty) {
            /*
                set the current value of `field` to an empty string
                this is applicable if the user just entered spaces
                as value to the `field`
            */
            field.prop('value', '');
            // display approriate error message in `error`
            error.text(fieldName + ' should not be empty.');
        }

        // else if the value of `field` is not empty
        else
            // remove the error message in `error`
            error.text('');

        // call isFilled() function to check if all field are filled
        var filled = isFilled();

        /*
            call isValidPassword() function
            to check if the value of `pw` field is valid
        */
        var validPassword = isValidPassword(field);

        /*
            call isValidUsername() function
            to check if the value of `username` field is valid
        */
        isValidUsername(field, function (validUsername) {

            /*
                if all fields are filled
                and the password contains at least 4 characters
                and the ID number contains  at least 4 characters and is unique
                then enable the `submit` button
            */
            if(filled && validPassword && validUsername)
                $('#submitAccount_ed').prop('disabled', false);

            /*
                else if at least one condition has not been met
                disable the `submit` button
            */
            else
                $('#submitAccount_ed').prop('disabled', true);
        });
    }

    /*
        attach the event `keyup` to the html element where id = `name_ed`
        this html element is an `<input>` element
        this event activates when the user releases a key on the keyboard
    */
    $('#name_ed').keyup(function () {

        // calls the validateField() function to validate `name_ed`
        validateField($('#name_ed'), 'Username', $('#unameEditError'));
    });

    /*
        attach the event `keyup` to the html element where id = `pw`
        this html element is an `<input>` element
        this event activates when the user releases a key on the keyboard
    */
    $('#password_ed').keyup(function () {

        // calls the validateField() function to validate `pw`
        validateField($('#password_ed'), 'Password', $('#passEditError'));
    });

});
