const express = require('express');

require('dotenv').config();

const user = require('../db/user');
const util = require('../lib/utility');

const router = new express.Router();

router.post('/user', (req, res) => {
	req.body.color = util.hextorgb(req.body.color);

	user.upsert(req.body, () => {
		res.json({status: 'success'});
	});
});

router.get('/user/:id', (req, res) => {
	user.get(req.params.id, user => res.json(user));
});

router.post('/users', (req, res) => {
	user.getAll(docs => {
		res.json(docs);
	});
});

module.exports = router;
