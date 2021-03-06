$(document).ready(function () {

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

    function isValidUsername(field, callback) {


        var uname = validator.trim($('#uname').val());
        var isValidLength = validator.isLength(uname, {min: 4});

        if(isValidLength) {
            $.get('/getCheckUsername', {username: uname}, function (result) {
                if(result.username != uname) {

                    if(field.is($('#uname')))
                        $('#unameError').text('');

                    return callback(true);

                }

                else {

                    if(field.is($('#uname')))
                        $('#unameError').text('Username number already registered.');

                    return callback(false);
                }
            });
        }

        else {

            if(field.is($('#uname')))
                $('#unameError').text('Username should contain 4 characters.');

            return callback(false);
        }
    }

    function isValidPassword(field) {

        // sets initial value of return variable to false
        var validPassword = false;

        /*
            gets the value of `pw` in the signup form
            removes leading and trailing blank spaces
            then checks if it contains at least 4 characters.
        */
        var password = validator.trim($('#pass').val());
        var isValidLength = validator.isLength(password, {min: 4});

        // if the value of `pw` contains at least 4 characters
        if(isValidLength) {

            /*
                check if the <input> field calling this function
                is the `pw` <input> field
            */
            if(field.is($('#pass')))
                // remove the error message in `passError`
                $('#passError').text('');

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
            if(field.is($('#pass')))
                // display appropriate error message in `passError`
                $('#passError').text(`Passwords should contain at least 4
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
        - value returned by function usValidUsername() is true

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
                and the username contains at least 4 characters and is unique
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
        attach the event `keyup` to the html element where id = `uname`
        this html element is an `<input>` element
        this event activates when the user releases a key on the keyboard
    */
    $('#uname').keyup(function () {

        // calls the validateField() function to validate `fName`
        validateField($('#uname'), 'Username', $('#unameError'));
    });

    /*
        attach the event `keyup` to the html element where id = `pass`
        this html element is an `<input>` element
        this event activates when the user releases a key on the keyboard
    */
    $('#pass').keyup(function () {

        // calls the validateField() function to validate `pw`
        validateField($('#pass'), 'Password', $('#passError'));
    });

});
