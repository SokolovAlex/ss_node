const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const config = require('./config');
const boot = require('./boot');
const auth = require('./routes/auth');
const pages = require('./routes/pages');
const api = require('./routes/api');
const upload = require('./routes/upload');

const app = express();
boot(app);

app.use(bodyParser.json({ limit: '150mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }));
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

const isProd = process.env.NODE_ENV === "prod";
const port = isProd ? 80 : 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});