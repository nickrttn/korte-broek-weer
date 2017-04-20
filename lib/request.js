const http = require('http');
const concat = require('concat-stream');

const request = {};

request.get = (url, cb) => {
	http.get(url, res => res.pipe(concat(onfinish)));

	function onfinish(buf) {
		cb(JSON.parse(buf));
	}
};

module.exports = request;
