var express = require('express');
var bodyParser = require('body-parser');

var path = require('path');
var http = require('http');

require('dotenv').config();

var app = express();
var server = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

var api = require('./routes/api');

app.use('/api', api);

app.set('port', process.env.PORT);

server.listen(app.get('port'), function(){
    console.log('app started on localhost:3005');
});

