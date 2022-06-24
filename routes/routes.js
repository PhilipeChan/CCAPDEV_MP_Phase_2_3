
// import module `express`
const express = require('express');

// import module `signupController` from `../controllers/signupController.js`
const signupController = require('../controllers/signupController.js');

// import module `successController` from `../controllers/successController.js`
const indexController = require('../controllers/indexController.js');

// import module `profileController` from `../controllers/profileController.js`
const accountController = require('../controllers/accountController.js');

// import module `loginController` from `../controllers/loginController.js`
const loginController = require('../controllers/loginController.js');

// import module `logoutController` from `../controllers/logoutController.js`
const logoutController = require('../controllers/logoutController.js');

// import module `validation` from `../helpers/validation.js`
const validation = require('../helpers/validation.js');

const fileUpload = require('express-fileupload');

const app = express();

app.use(fileUpload());

app.get('/', signupController.getSignUp);

/*
    execute function getIndex()
    defined in object `controller` in `../controllers/controller.js`
    when a client sends an HTTP GET request for `/`
*/
app.get('/index', indexController.getIndex);

app.post('/indexCreate', indexController.postCreate);

app.get('/signup', signupController.getSignUp);

/*
    execute function postSignUp()
    defined in object `signupController` in `../controllers/signupController.js`
    when a client sends an HTTP POST request for `/signup`
*/
app.post('/signup', validation.signupValidation(), signupController.postSignUp);

/*
    execute function getCheckID()
    defined in object `signupController` in `../controllers/signupController.js`
    when a client sends an HTTP GET request for `/getCheckID`
*/
app.get('/getCheckUsername', signupController.getCheckUsername);

/*
    execute function getLogIn()
    defined in object `loginController` in `../controllers/loginController.js`
    when a client sends an HTTP GET request for `/login`
*/
app.get('/login', loginController.getLogIn);

/*
    execute function postLogIn()
    defined in object `loginController` in `../controllers/loginController.js`
    when a client sends an HTTP POST request for `/login`
*/
app.post('/login', loginController.postLogIn);

/*
    execute function getProfile()
    defined in object `profileController` in `../controllers/profileController.js`
    when a client sends an HTTP GET request for `/profile/:idNum`
    where `idNum` is a parameter
*/
app.get('/account/:username', accountController.getAccount);

/*
    execute function getLogOut()
    defined in object `logoutController` in `../controllers/logoutController.js`
    when a client sends an HTTP GET request for `/logout`
*/
app.get('/logout', logoutController.getLogOut);

/*
    exports the object `app` (defined above)
    when another script exports from this file
*/
module.exports = app;