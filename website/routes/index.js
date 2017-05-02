var express = require('express');

var http = require('http');
var request = require('request');
var router = express.Router();
var env = require( 'dotenv' ).config();

//render the homepage
router.get('/', function(req, res) {
  res.render('index', { title: 'welkom' });
});

//post request to api server
router.post('/', function(req, res) {

request.post({
 url: process.env.ENDPOINT,
 form: {
  id: req.body.boxid.value,
  name: req.body.name.value,
  color: req.body.color.value
 },
 json: true
}, function(err, response, body) {
    if (err) {
      res.render('failure', {error: err});
    } else {
      res.render('success', {body: body});
    }
 });
});

module.exports = router;
