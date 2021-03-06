const express = require('express');
const bodyParser = require('body-parser');

const pollWeather = require('./lib/weather');
const api = require('./routes/api');

require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', api);



app.listen(process.env.PORT, err => {
	if (err) throw err; // eslint-disable-line curly

	console.log(`---- listening on http://localhost:${process.env.PORT}`);
});

pollWeather(process.env.POLLING_RATE);
