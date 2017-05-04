const express = require('express');

require('dotenv').config();

const user = require('../db/user');
const util = require('../lib/utility');
const weather = require('../db/weather');

const router = new express.Router();
let percentage = [];

router.post('/user', (req, res) => {
	req.body.color = util.hextorgb(req.body.color);
 req.body.type = "user";
 console.log(req.body.type);
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
 function allUsers(users) {
  if(users.doc.type){
    // if(users.doc.status === 1){
      return users.doc.type;

    // }

  }
 }


  function filterType(users) {
  if(users.doc.type){
    if(users.doc.status === 1){


      return users.doc.type;

    }

  }
 }

 let getShortPantsUsers = docs.rows.filter(filterType);
 let getAllUsers = docs.rows.filter(allUsers);

 if (getShortPantsUsers.length === 0){

 } else{
   let shortPants = getShortPantsUsers.length;

 console.log(getShortPantsUsers.length);
 }

 let percentage = (getAllUsers.length / getShortPantsUsers.length);
  });
 });

router.post('/user/:id/status', (req, res) => {
 user.upsert(req.params.id, (doc) => {
  doc.status =  req.body;
  console.log(req.params.id);
  res.json({status: 'success'});
 });


});



module.exports = router;
