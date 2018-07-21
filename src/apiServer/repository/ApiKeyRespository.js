const mysql  = require('mysql');
const BaseRespository = require('./BaseRepository');

class ApiKeyRespository extends BaseRespository {

	getApiKeys(projectId) {
		return new Promise((resolve, reject) => {

			this.connection.connect();

			this.connection.query('SELECT * from api_keys where project_id=?', [projectId],
				function (error, results, fields) {
				if (error) return reject(error);
				return resolve(results);
			});

			this.connection.end();

		});
	}

	getApiKey(apiKeyId) {
		return new Promise((resolve, reject) => {

			this.connection.connect();

			this.connection.query('SELECT * from api_keys where id=?', [apiKeyId],
				function (error, results, fields) {
					if (error) return reject(error);
					return resolve(results[0]);
				});

			this.connection.end();

		});
	}

	/**
	 *
	 * @param projectId
	 * @param name
	 * @param key
	 * @param restrictionType
	 * @param restrictionValue
	 * @return {Promise}
	 */
	createApiKey(projectId, name, key, restrictionType, restrictionValue) {
		return new Promise((resolve, reject) => {

			this.connection.connect();

			// TODO change keyword `key` to unreserved mysql
			this.connection.query('INSERT INTO api_keys(project_id, name, `key`, restriction_type, restriction_value) VALUES(?,?,?,?,?)',
				[projectId, name, key, restrictionType, restrictionValue],
				(error, results, fields) => {
					if (error) return reject(error);
					return resolve(results);
				});

			this.connection.end();
		});
	}

	/**
	 *
	 * @param apiKeyId
	 * @return {Promise}
	 */
	deleteApiKey(apiKeyId) {
		return new Promise((resolve, reject) => {

			this.connection.connect();

			this.connection.query('DELETE FROM api_keys WHERE id=?',
				[apiKeyId],
				(error, results, fields) => {
					if (error) return reject(error);
					return resolve(results);
				});

			this.connection.end();
		});
	}

	/**
	 *
	 * @param apiKeyId
	 * @param name
	 * @param key
	 * @param restrictionType
	 * @param restrictionValue
	 * @return {Promise}
	 */
	updateApiKey(apiKeyId, name, key, restrictionType, restrictionValue) {
		return new Promise((resolve, reject) => {

			this.connection.connect();

			this.connection.query('UPDATE api_keys SET name=?,`key`=?,restriction_type=?,restriction_value=? WHERE id=?',
				[name, key, restrictionType, restrictionValue, apiKeyId],
				(error, results, fields) => {
					if (error) return reject(error);
					return resolve(results);
				});

			this.connection.end();

		});
	}
}

module.exports = ApiKeyRespository;