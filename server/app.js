var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var auth = require('./routes/auth');
var pages = require('./routes/pages');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', pages);
app.use('/auth', auth);

app.set('view engine', 'jade');
app.set('views', __dirname + '/../build/views');

app.use(express.static(__dirname + '/../build'));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');



});