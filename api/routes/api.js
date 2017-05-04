const express = require('express');

require('dotenv').config();

const user = require('../db/user');
const util = require('../lib/utility');

const router = new express.Router();
let percentage = [];
router.post('/user', (req, res) => {
	req.body.color = util.hextorgb(req.body.color);
 req.body.type = "user";
	user.upsert(req.body, (body) => {
		res.json({status: 'success'});
	});
});

router.get('/user/:id', (req, res) => {
	user.get(req.params.id, user => res.json(user));
});

router.get('/users', (req, res) => {
	user.getAll(docs => {
		res.json(docs);
	});
});

router.get('/temperature', (req, res) => {
  user.get('temperatureColor', user => res.json(user));
});

router.get('/percentage', (req, res) => {
 user.getAll(docs => {
  res.json(docs);
  percentage.push(docs);
  console.log(docs);
 });
});

router.post('/user/:id/status', (req, res) => {
 user.upsert(req.params.id, (doc) => {
  doc.status =  req.body;
  res.json({status: 'success'});
 });


});



module.exports = router;
