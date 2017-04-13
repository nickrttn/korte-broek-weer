var concat = require('concat-stream');
var http = require('http');
var env = require('dotenv').config();
var express = require('express');
var router = express.Router();

var apikey = process.env.APIKEY; //invisible apiKey
var url = `http://api.openweathermap.org/data/2.5/weather?q=Amsterdam&APPID=${apikey}&units=metric`;

console.log(url);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'welkom' });
  load(callback, url); //calls function load, gives the url and calls function callback
});

function callback(data) {
  var temp = data.main.temp;
  if(temp >= 20) {
    console.log('Korte broeken weer');
    // kleur groen naar node mcu
  } else {
    console.log('Helaas');
    // kleur rood naar node mcu
  }
}

function load(callback, url) {
  http.get(url, function(res) {
    res.pipe(concat(onfinish));
  });

  function onfinish(buffer) {
    callback(JSON.parse(buffer));
  }
}

module.exports = router;
