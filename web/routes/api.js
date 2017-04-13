var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('46 74 91');
});


load(callback, url); //calls function load, gives the query and calls function callback
function callback(data) {
  var temp = data.main.temp;
  var speed = data.wind.speed;

  console.log(temp, speed);

  function computeFactor(t, s) {
  var windchill = calculateChill(temp, speed);
    if(windchill >= 20) {
      console.log('Korte broeken weer');
      // kleur groen naar node mcu
    } else {
      console.log('Helaas');
      // kleur rood naar node mcu
    }
  return windchill.toFixed(2);
 }

 function calculateChill(tempF, speed) {
  var chill = (35.74 + (.6215 * tempF)) - (35.75 * Math.pow(speed, .16)) + (.4275 * (tempF * Math.pow(speed, .16)));
    var celsius = (chill - 32) * 5 / 9;
  return celsius;
 }
  console.log("Het voelt als " + computeFactor(temp, speed) + " graden celsius");
}


module.exports = router;
