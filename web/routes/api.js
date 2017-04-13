var concat = require('concat-stream');
var https = require('https');
var env = require('dotenv').config();
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('46 74 91');
});

module.exports = router;
