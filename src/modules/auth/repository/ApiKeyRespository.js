import BaseRespository from '../../../repository/BaseRepository';
import apiKeySchema from '../schema/apiKeySchema';

export default class ApiKeyRepository extends BaseRespository {

	constructor(conn, app) {
		super(conn, app)

		this.ApiKey = this.conn.model('ApiKey', apiKeySchema);
	}

    getApiKeys() {
        return new Promise((resolve, reject) => {
        	this.ApiKey.find(function(err, apiKeys) {
                if (err) return reject(err);
                return resolve(apiKeys);
            });
        });
    }

    getApiKey(apiKeyId) {
        return new Promise((resolve, reject) => {
            this.ApiKey.findOne({_id: apiKeyId}, function(err, apiKey) {
                if (err) return reject(err);
                return resolve(apiKey);
            });
        });
    }

    getApiKeyByKey(key) {
        return new Promise((resolve, reject) => {
            this.ApiKey.findOne({key: key}, function(err, apiKey) {
                if (err) return reject(err);
                return resolve(apiKey);
            });
        });
    }

    /**
     *
     * @param name
     * @param key
     * @param restrictionType
     * @param restrictionValue
     * @return {Promise}
     */
    createApiKey( name, key, restrictionType, restrictionValue) {
        return new Promise((resolve, reject) => {

            let newApiKey = new this.ApiKey({
                name,
                key,
                restriction_type: restrictionType,
                restriction_value: restrictionValue,
            });

            newApiKey.save((err, newApiKey) => {
                if (err) return reject(err);
                resolve(newApiKey);
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
            this.ApiKey.deleteOne({_id: apiKeyId}, function(err) {
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

            this.ApiKey.update({ _id: apiKeyId }, payload, function(err, res) {
                if (err) return reject(err);
                return resolve(res);
            });
        });
    }
}