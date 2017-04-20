const db = require('./create');

const weather = {};

weather.upsert = (color, cb) => {
	db.upsert('temperatureColor', doc => {
		return doc.rev ? {
			_id: 'temperatureColor',
			_rev: doc.rev,
			color: {r: color[0], g: color[1], b: color[2]}
		} : {
			_id: 'temperatureColor',
			color: {r: color[0], g: color[1], b: color[2]}
		};
	}, (err, res) => {
		if (err) throw err; // eslint-disable-line curly
		if (cb) cb(res); // eslint-disable-line curly
	});
};

weather.get = cb => {
	db.get('temperatureColor', (err, doc) => {
		if (err) throw err; // eslint-disable-line curly
		cb(doc);
	});
};

module.exports = weather;
