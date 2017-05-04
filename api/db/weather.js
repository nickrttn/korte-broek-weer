const db = require('./create');

const weather = {};

weather.upsert = (temp,cb) => {
	db.upsert('temperatureColor', doc => {
		return doc.rev ? {
			_id: 'temperatureColor',
			_rev: doc.rev,
			temp: temp,

		} : {
			_id: 'temperatureColor',
			temp: temp
		};
	}, (err, res) => {
		if (err) throw err; // eslint-disable-line curly
		if (cb) cb(res); // eslint-disable-line curly
	});
};

weather.get = (id, cb) => {
	db.get(id, (err, doc) => {
		if (err) throw err; // eslint-disable-line curly
		cb(doc);
	});
};

module.exports = weather;
