import axios from 'axios'

function ApiClient(options) {

    let axiosInstance = axios.create({
        baseURL: options.baseURL,
        timeout: 10000,
        params: {
            api_key: options.apiKey
        }
    });

    this.options = Object.assign({}, {
        access_token: null
    }, options);

    this.axiosInstance = axiosInstance;
}

ApiClient.prototype._doGetRequest = async function _doGetRequest(path) {
    let response = await this.axiosInstance.get(`${path}`);
    return response.data;
};

ApiClient.prototype._doPostRequest = async function _doPostRequest(path, data) {
    let response = await this.axiosInstance.post(`${path}`, data);
    return response.data;
};

export default ApiClient