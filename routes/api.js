var express = require( 'express' );
var concat = require( 'concat-stream' );
var http = require( 'http' );
var env = require( 'dotenv' ).config();
var router = express.Router();
var d3Scale = require( 'd3-scale' );
var hexToRgb = require('hex-to-rgb');
var PouchDB = require('pouchdb');
var db = new PouchDB('korte_broekdb');
PouchDB.plugin(require('pouchdb-upsert'));

router.post('/user', function(req, res) {
  var color = hexToRgb(req.body.color);
  load( function( data ) {

    res.json( getColor(computeFactor(data.main.temp, data.wind.speed)));
  }, url );

  db.upsert(req.body.id, function(doc) {
    return doc.rev ? {
     _id: req.body.id,
     _rev: doc.rev,
     name: req.body.name,
     color: {
      r:color[0],
      g:color[1],
      b:color[2]
     }

    } : {
     _id: req.body.id,
     name: req.body.name,
     color: {
      r:color[0],
      g:color[1],
      b:color[2]
     }
    };
   }, function(err) {
    if (err) throw err;
   });
});

var url = process.env.WHEATHERURL;
var color = d3Scale.scaleLinear().domain( [ -10, 35 ] ) //range temperaturen
  .range( [ "#0051AD", "#FFAF30", "#FF0B00" ] ); //kleuren

function load( callback, url ) {
  http.get( url, function( res ) {
    res.pipe( concat( onfinish ) );
  } );

  function onfinish( buffer ) {
    callback( JSON.parse( buffer ) );
  }
}

function computeFactor( t, s ) {
  var windchill = calculateChill( t, s );
  return windchill.toFixed( 2 );
}

function calculateChill( tempF, speed ) {
  var chill = ( 35.74 + ( .6215 * tempF ) ) - ( 35.75 * Math.pow( speed, .16 ) ) + ( .4275 * ( tempF * Math.pow( speed, .16 ) ) );
  var celsius = ( chill - 32 ) * 5 / 9;
  return celsius;
}

function getColor( temp ) {
  var tempColor = color( temp );
  tempColor = tempColor.replace( 'rgb(', '' );
  tempColor = tempColor.replace( ')', '' );
  tempColor = tempColor.split(', ');
  return {
    r: tempColor[0],
    g: tempColor[1],
    b: tempColor[2]
  };
}

router.get('/user/:id', function(req, res) {
  db.get(req.params.id, function(err, doc) {
    if (err) throw err;
    res.json(doc);
  });
});


router.get('/user/:id', function(req, res) {
  db.get(req.params.id, function(err, body) {
    res.json(body);
  });
});

router.post('/users', function(req, res) {
  db.allDocs({
    include_docs: true,
    attachments: true
  }).then(function (result) {
    console.log(result);
  }).catch(function (err) {
    console.log(err);
  });
});


module.exports = router;
