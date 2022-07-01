const express = require('express');

const signupController = require('../controllers/signupController.js');

const indexController = require('../controllers/indexController.js');

const accountController = require('../controllers/accountController.js');

const loginController = require('../controllers/loginController.js');

const logoutController = require('../controllers/logoutController.js');

const aboutController = require('../controllers/aboutController.js');

const validation = require('../helpers/validation.js');

const fileUpload = require('express-fileupload');

const app = express();

app.use(fileUpload());

app.get('/', signupController.getSignUp);

app.get('/index', indexController.getIndex);

app.get('/about', aboutController.getAbout);

app.post('/indexCreate', indexController.postCreate);
app.post('/indexEdit', indexController.postEdit);
app.post('/indexDelete', indexController.postDelete);
app.post('/indexCommentCreate', indexController.postCommentCreate);
app.post('/indexCommentEdit', indexController.postCommentEdit);
app.post('/indexCommentDelete', indexController.postCommentDelete);
app.post('/indexSearch', indexController.postSearch);

app.get('/upRep', indexController.getUpRep);
app.get('/downRep', indexController.getDownRep);

app.get('/signup', signupController.getSignUp);

app.post('/signup', validation.signupValidation(), signupController.postSignUp);

app.get('/getCheckUsername', signupController.getCheckUsername);

app.get('/login', loginController.getLogIn);

app.post('/login', loginController.postLogIn);

app.get('/account/:username', accountController.getAccount);
app.post('/indexAccountEdit', validation.signupValidation(), accountController.postAccountEdit);
app.post('/indexAccountDelete', accountController.postAccountDelete);

app.get('/logout', logoutController.getLogOut);

module.exports = app;
