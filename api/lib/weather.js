const weather = require('../db/weather');
const util = require('./utility');
const request = require('./request');

module.exports = time => {
	function getWindchill() {
		request.get(process.env.WEATHERMAP_ENDPOINT, res => {
   // console.log(util.windChill(res.main.temp, res.wind.speed).toFixed(0));
   const temp = util.windChill(res.main.temp, res.wind.speed).toFixed(0);
			// const color = util.getColor(util.windChill(res.main.temp, res.wind.speed));
			weather.upsert(temp);
		});
	}

	setInterval(getWindchill, time);
	getWindchill();

};
