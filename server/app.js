var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
var config = require('./config');

var boot = require('./boot');

boot(app);

var auth = require('./routes/auth');
var pages = require('./routes/pages');
var api = require('./routes/api');
var upload = require('./routes/upload');

//var connect = require('connect');
//connect().use(connect.limit('5.5mb'));

app.use(bodyParser.json({limit: '150mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());

app.use('/', pages(app));
app.use('/auth', auth(app));
app.use('/api', api(app));
app.use('/upload', upload(app));

app.config = config;
app.upload_path = __dirname + '/../upload/';

app.set('view engine', 'jade');
app.set('views', __dirname + '/../build/views');

app.use(express.static(__dirname + '/../build'));
app.use('/upload', express.static(__dirname + '/../upload'));

var isProd = process.env.NODE_ENV === "prod";
var port = isProd ? 80 : 3000;

app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
});

