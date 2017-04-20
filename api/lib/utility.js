const d3Scale = require('d3-scale');
const hexToRgb = require('hex-to-rgb');

const util = {};

util.windChill = (temp, windspeed) => {
	windspeed *= 3.6;
	windspeed = Math.pow(windspeed, 0.16);

	let windChill = 13.12 + (0.6215 * temp) - (11.37 * windspeed) + (0.3965 * temp * windspeed);
	windChill = parseFloat(windChill.toFixed(2));
	windChill = (windspeed <= 4.8) ? temp : windChill;
	windChill = (temp > 10) ? temp : windChill;

	return windChill;
};

util.getColor = temp => {
	const color = d3Scale.scaleLinear();

	color
		.domain([-10, 35])
		.range(['#0051AD', '#FFAF30', '#FF0B00']);

	let tempColor = color(temp);

	tempColor = tempColor.replace('rgb(', '');
	tempColor = tempColor.replace(')', '');
	tempColor = tempColor.split(', ');

	return {
		r: tempColor[0],
		g: tempColor[1],
		b: tempColor[2]
	};
};

util.hextorgb = hex => hexToRgb(hex);

module.exports = util;
