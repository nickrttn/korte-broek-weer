var express = require( 'express' );
var concat = require( 'concat-stream' );
var http = require( 'http' );
var env = require( 'dotenv' ).config();
var router = express.Router();
var apikey = process.env.APIKEY;
var d3Scale = require( 'd3-scale' );
var url = `http://api.openweathermap.org/data/2.5/weather?q=Amsterdam&APPID=${apikey}&units=imperial`;
var color = d3Scale.scaleLinear().domain( [ -10, 35 ] ) //range temperaturen
  .range( [ "#FF0B00", "#FFAF30", "#0051AD" ] ); //kleuren
router.get( '/', function( req, res, next ) {
  load( function( data ) {
  	console.log(getColor(computeFactor(data.main.temp, data.wind.speed)));
    res.json( getColor(computeFactor(data.main.temp, data.wind.speed)));
  }, url );
} );

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

module.exports = router;
