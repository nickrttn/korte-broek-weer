var express = require('express');
var PouchDB = require('pouchdb');

var router = express.Router();

var db = new PouchDB('korte_broek');

PouchDB.plugin(require('pouchdb-upsert'));

db.upsert( function(doc) {
    return doc.rev ? {
     // _id: req.body.boxid.value,
     // _rev: doc.rev,
     // name: list.name,
     // color: req.body.color.value

    } : {
     // _id: list.id,
     // name: list.name,
     // color: req.body.color.value
    };
   }, function(err) {
    if (err) throw err;
   });


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'welkom' });
});

router.post('/', function(req, res) {

  // db.get('id', function(err, doc) {
  //  if (err) throw err;

  //  db.put({
  //   _id: req.body.boxid.value,
  //   _rev: doc.rev,
  //   name: req.body.name.value,
  //   color: req.body.color.value
  //  });
  // });

  // db.put({
  //   _id: req.body.boxid.value,
  //   name: req.body.name.value,
  //   color:  req.body.color.value
  // });

 //  db.get('wee').then(function (doc) {
 //   console.log(doc.color, doc._id);

 //  }).catch(function (err) {
 //    console.log(err);
 // });
 // db.changes().on('change', function() {

 // });
});


module.exports = router;
