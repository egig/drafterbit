const ApiClient = {

    getApiKeys: async function getApiKeys() {
        return this._doGetRequest('/api_keys');
    },

    getApiKey: async function getApiKey(apiKeyId) {
        return this._doGetRequest(`/api_keys/${apiKeyId}`);
    },

    createApiKey: async function createApiKey(name, key, restrictionType, restrictionValue) {
        let response = await this.axiosInstance.post('/api_keys', {
            name,
            key,
            restriction_type: restrictionType,
            restriction_value: restrictionValue
        });

        return response.data;
    },

    updateApiKey: async function updateApiKey(apiKeyId, name, key, restrictionType, restrictionValue) {
        let response = await this.axiosInstance.patch(`/api_keys/${apiKeyId}`, {
            apiKeyId, name, key, restriction_type: restrictionType, restriction_value: restrictionValue
        });
        return response.data;
    }
};

export default ApiClient;