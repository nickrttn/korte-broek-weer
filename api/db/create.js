const PouchDB = require('pouchdb');
const upsert = require('pouchdb-upsert');

PouchDB.plugin(upsert);

const db = new PouchDB('korte_broekdb');

module.exports = db;
