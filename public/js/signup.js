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
        var uname = validator.trim($('#uname').val());
        var pass = validator.trim($('#pass').val());

        /*
            checks if the trimmed values in fields are not empty
        */
        var unameEmpty = validator.isEmpty(uname);
        var passEmpty = validator.isEmpty(pass);

        return !passEmpty && !unameEmpty;
    }

    /*
        Function which returns true if value of `idNum` is a valid ID number.
        Otherwise, this function returns false.
        A valid ID number must contain EXACTLY 8 digits
        and has not been used by another other users yet.

        The function has 2 parameters:
        - field - refers to the current <input> field calling this function
        - callback - function called after the execution of isValid()
    */
    function isValidUsername(field, callback) {

        /*
            gets the value of `idNum` in the signup form
            removes leading and trailing blank spaces
            then checks if it contains exactly 8 digits
        */
        var uname = validator.trim($('#uname').val());
        var isValidLength = validator.isLength(uname, {min: 4});

        // if the value of `idNum` contains exactly 8 digits
        if(isValidLength) {
            /*
                send an HTTP GET request using JQuery AJAX
                the first parameter is the path in our server
                which is defined in `../../routes/routes.js`
                the server will execute the function getCheckID()
                defined in `../../controllers/signupController.js`
                the second parameter passes the variable `idNum`
                as the value of the field `idNum` to the server
                the last parameter executes a callback function
                when the server sent a response
            */
            $.get('/getCheckUsername', {username: uname}, function (result) {

                // if the value of `idNum` does not exists in the database
                if(result.username != uname) {

                    /*
                        check if the <input> field calling this function
                        is the `idNum` <input> field
                    */
                    if(field.is($('#uname')))
                        // remove the error message in `idNumError`
                        $('#unameError').text('');

                    /*
                        since  the value of `idNum` contains exactly 8 digits
                        and is not yet used by another user in the database
                        return true.
                    */
                    return callback(true);

                }

                // else if the value of `idNum` exists in the database
                else {

                    /*
                        check if the <input> field calling this function
                        is the `idNum` <input> field
                    */
                    if(field.is($('#uname')))
                        // display appropriate error message in `idNumError`
                        $('#unameError').text('Username number already registered.');

                    /*
                        since the value of `idNum`
                        is used by another user in the database
                        return false.
                    */
                    return callback(false);
                }
            });
        }

        // else if the value of `idNum` is less or more than 8 digits
        else {

            /*
                check if the <input> field calling this function
                is the `idNum` <input> field
            */
            if(field.is($('#uname')))
                // display appropriate error message in `idNumError`
                $('#unameError').text('ID Number should contain 4 characters.');

            /*
                since the value of `idNum` is less or more than 8 digits
                return false.
            */
            return callback(false);
        }
    }

    /*
        Function which returns true if value of `pw` is a valid ID number.
        Otherwise, this function returns false.
        A valid password must contain AT LEAST 8 characters.

        The function has 1 parameter:
        - field - refers to the current <input> field calling this function
    */
    function isValidPassword(field) {

        // sets initial value of return variable to false
        var validPassword = false;

        /*
            gets the value of `pw` in the signup form
            removes leading and trailing blank spaces
            then checks if it contains at least 8 characters.
        */
        var password = validator.trim($('#pass').val());
        var isValidLength = validator.isLength(password, {min: 4});

        // if the value of `pw` contains at least 8 characters
        if(isValidLength) {

            /*
                check if the <input> field calling this function
                is the `pw` <input> field
            */
            if(field.is($('#pass')))
                // remove the error message in `idNumError`
                $('#passError').text('');

            /*
                since  the value of `pw` contains at least 8 characters
                set the value of the return variable to true.
            */
            validPassword = true;
        }

        // else if the value of `pw` contains less than 8 characters
        else {

            /*
                check if the <input> field calling this function
                is the `pw` <input> field
            */
            if(field.is($('#pass')))
                // display appropriate error message in `pwError`
                $('#passError').text(`Passwords should contain at least 4
                    characters.`);
        }

        // return value of return variable
        return validPassword;
    }

    /*
        Function which checks if the `field` is empty.
        This also calls functions isFilled(), isValidPassword(), and
        isValidID().
        This is attached to the `keyup` event of each field
        in the signup form.
        This activates the `submit` button if:
        - value returned by function isFilled() is true
        - value returned by function isValidPassword() is true
        - value returned by function usValidID() is true

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
            call isValidID() function
            to check if the value of `idNum` field is valid
        */
        isValidUsername(field, function (validUsername) {

            /*
                if all fields are filled
                and the password contains at least 8 characters
                and the ID number contains exactly 8 digits and is unique
                then enable the `submit` button
            */
            if(filled && validPassword && validUsername)
                $('#submit_signup').prop('disabled', false);

            /*
                else if at least one condition has not been met
                disable the `submit` button
            */
            else
                $('#submit_signup').prop('disabled', true);
        });
    }

    /*
        attach the event `keyup` to the html element where id = `fName`
        this html element is an `<input>` element
        this event activates when the user releases a key on the keyboard
    */
    $('#uname').keyup(function () {

        // calls the validateField() function to validate `fName`
        validateField($('#uname'), 'Username', $('#unameError'));
    });

    /*
        attach the event `keyup` to the html element where id = `pw`
        this html element is an `<input>` element
        this event activates when the user releases a key on the keyboard
    */
    $('#pass').keyup(function () {

        // calls the validateField() function to validate `pw`
        validateField($('#pass'), 'Password', $('#passError'));
    });

});
