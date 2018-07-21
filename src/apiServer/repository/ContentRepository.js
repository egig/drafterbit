const mysql  = require('mysql');
const BaseRespository = require('./BaseRepository');

class ContentRepository extends BaseRespository {

	getContents(contentTypeId) {
		return new Promise((resolve, reject) => {

			this.connection.connect();

			this.connection.query('SELECT * from contents WHERE content_type_id=?',
				[contentTypeId],
				(error, results, fields) => {
					if (error) return reject(error);
					return resolve(results);
				});

			this.connection.end();

		});
	}

	/**
	 *
	 * @param contentTypeId
	 * @param contentValues
	 * @return {Promise}
	 */
	createContent(contentTypeId, contentValues) {
		return new Promise((resolve, reject) => {

			this.connection.connect();

			this.connection.query('INSERT contents(content_type_id,content_values) VALUES(?,?)',
				[contentTypeId,contentValues],
				(error, results, fields) => {
					if (error) return reject(error);
					return resolve(results);
				});

			this.connection.end();

		});
	}
}

module.exports = ContentRepository;