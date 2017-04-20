const db = require('./create');

const user = {};

user.upsert = (data, cb) => {
	db.upsert(data.id, doc => {
		return doc.rev ? {
			_id: data.id,
			_rev: doc.rev,
			name: data.name,
			color: {
				r: data.color[0],
				g: data.color[1],
				b: data.color[2]
			}
		} : {
			_id: data.id,
			name: data.name,
			color: {
				r: data.color[0],
				g: data.color[1],
				b: data.color[2]
			}
		};
	}, err => {
		cb('error');
		if (err) throw err; // eslint-disable-line curly
	});
	cb('success');
};

user.get = (id, cb) => {
	db.get(id, (err, doc) => {
		if (err) throw err; // eslint-disable-line curly
		cb(doc);
	});
};

user.getAll = cb => {
	db.allDocs({
		include_docs: true, // eslint-disable-line camelcase
		attachments: true
	}, (err, docs) => {
		if (err) throw err; // eslint-disable-line curly
		cb(docs);
	});
};

module.exports = user;
