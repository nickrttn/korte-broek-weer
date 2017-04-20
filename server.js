var path = require('path');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');

var api = require('./routes/api');

require('dotenv').config();

var app = express();

app.set('port', process.env.PORT);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', api);

app.listen(app.get('port'), function(){
  console.log(`---- listening on http://localhost:${app.get('port')}`);
});
