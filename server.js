/**
 * Created by alexs_000 on 21.05.2016.
 */
var express = require('express');
var app = express.createServer();

app.use(express.static(__dirname + '/build'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/build/views/index.html');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});