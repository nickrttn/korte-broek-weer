var path = require('path');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');

var index = require('./routes/index');

require('dotenv').config();

var app = express();

app.set('port', process.env.PORT);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
app.use('/user/add', index);

app.listen(app.get('port'), function(err) {
	if (err) throw err;
  console.log(`app started on localhost:${app.get('port')}`);
});
