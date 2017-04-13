var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var path = require('path');
var http = require('http');
var path = require('path');

var server = http.createServer(app);

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

var index = require('./routes/index');

app.use('/', index);

app.set('port', process.env.PORT);

server.listen(app.get('port'), function(){
    console.log('app started on localhost:3005');
});
