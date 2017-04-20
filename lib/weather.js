const util = require('./utility');
const request = require('./request');
const weather = require('../db/weather');

module.exports = time => {
	function getWindchill() {
		request.get(process.env.WEATHERMAP_ENDPOINT, res => {
			const color = util.getColor(util.windChill(res.main.temp, res.wind.speed));
			weather.upsert(color, res => console.log(res));
		});
	}

	setInterval(getWindchill, time);
	getWindchill();
};
