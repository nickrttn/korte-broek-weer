const PouchDB = require('pouchdb');
const upsert = require('pouchdb-upsert');

PouchDB.plugin(upsert);

require('dotenv').config();

const db = new PouchDB(process.env.COUCHDB_ENDPOINT);

module.exports = db;
