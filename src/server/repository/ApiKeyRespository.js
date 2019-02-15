const BaseRespository = require('./BaseRepository');
const model = require('../model');

class ApiKeyRespository extends BaseRespository {

    getApiKeys(projectId) {
	    return new Promise((resolve, reject) => {
		    model.ApiKey.find({project: projectId}, function(err, apiKeys) {
			    if (err) return reject(err);
			    return resolve(apiKeys);
		    });
	    });
    }

    getApiKey(apiKeyId) {
	    return new Promise((resolve, reject) => {
		    model.ApiKey.findOne({_id: apiKeyId}, function(err, apiKey) {
			    if (err) return reject(err);
			    return resolve(apiKey);
		    });
	    });
    }

		getApiKeyByKey(key, projectId) {
			return new Promise((resolve, reject) => {
				model.ApiKey.findOne({key: key, project:projectId}, function(err, apiKey) {
					if (err) return reject(err);
					return resolve(apiKey);
				});
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

		    let newApiKey = new model.ApiKey({
			    name,
			    key,
			    restriction_type: restrictionType,
			    restriction_value: restrictionValue,
			    project: projectId
		    });

		    newApiKey.save((err, newApiKey) => {
			    if (err) return reject(err);
			    resolve(newApiKey)
		    });

	    });
    }

    /**
	 *
	 * @param apiKeyId
	 * @return {Promise}
	 */
    deleteApiKey(apiKeyId) {
	    return new Promise((resolve, reject) => {
		    model.ApiKey.deleteOne({_id: apiKeyId}, function(err) {
			    if (err) return reject(err);
			    return resolve(true);
		    });
	    });
    }

	/**
	 *
	 * @param apiKeyId
	 * @param payload
	 * @return {Promise}
	 */
    updateApiKey(apiKeyId, payload) {
		return new Promise((resolve, reject) => {

			model.ApiKey.update({ _id: apiKeyId }, payload, function(err, res) {
				if (err) return reject(err);
				return resolve(res);
			});
		});
    }
}

module.exports = ApiKeyRespository;