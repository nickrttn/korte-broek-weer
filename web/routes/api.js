var concat = require('concat-stream');
var https = require('https');
var env = require('dotenv').config();

function getData(recieve){
    https.get('https://www.rijksmuseum.nl/api/nl/collection/?key=' + process.env.API_KEY + '&format=json&q=', function (res) {
    res.pipe(concat(callback));

      function callback(argument) {

        var data = JSON.parse(argument);
        recieve(data);
      }
  });
}
module.exports = router;
