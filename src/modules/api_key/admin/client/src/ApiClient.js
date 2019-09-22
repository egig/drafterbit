import axios from 'axios';

class ApiClient {

    constructor(options) {

        let axiosInstance = axios.create({
            baseURL: options.baseURL,
            timeout: 10000,
            params: {
                api_key: options.apiKey
            }
        });

        this.options = Object.assign({}, {
            project: null,
            access_token: null
        }, options);

        this.axiosInstance = axiosInstance;
    }

    async _doGetRequest(path) {
        let response = await this.axiosInstance.get(`${path}`);
        return response.data;
    }

    async _doPostRequest(path, data) {
        let response = await this.axiosInstance.post(`${path}`, data);
        return response.data;
    }

    async getFieldTypes() {
        let response = await this.axiosInstance.get('/field_types');
        return response.data;
    }


    async getApiKeys() {
        return this._doGetRequest('/api_keys');
    }

    async getApiKey(apiKeyId) {
        return this._doGetRequest(`/api_keys/${apiKeyId}`);
    }

    async createApiKey(name, key, restrictionType, restrictionValue) {
        let response = await this.axiosInstance.post('/api_keys', {
            name,
            key,
            restriction_type: restrictionType,
            restriction_value: restrictionValue
        });

        return response.data;
    }

    async updateApiKey(apiKeyId, name, key, restrictionType, restrictionValue) {
        let response = await this.axiosInstance.patch(`/api_keys/${apiKeyId}`, {
            apiKeyId, name, key, restriction_type: restrictionType, restriction_value: restrictionValue
        });
        return response.data;
    }
}

export default ApiClient;