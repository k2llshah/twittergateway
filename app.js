var express = require("express");
var path = require('path');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/twitter')
var bodyParser = require("body-parser");
var passport = require('passport')
var cookieParser = require("cookie-parser");
var request = require("request");
var Twitter = require("twitter");
require('./models/tweet_model.js');
var session = require('express-session');

var app = express();

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(session({
    secret: "RQSHJD23HG"
}));

require('./routes/index')(app, passport);
app.listen(8000);

console.log("Server started on port:8000");