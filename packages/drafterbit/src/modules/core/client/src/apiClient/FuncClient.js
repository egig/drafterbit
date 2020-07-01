import axios from 'axios'

function FuncClient(options) {

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

FuncClient.prototype._doGetRequest = async function _doGetRequest(path) {
    let response = await this.axiosInstance.get(`${path}`);
    return response.data;
};

FuncClient.prototype._doPostRequest = async function _doPostRequest(path, data) {
    let response = await this.axiosInstance.post(`${path}`, data);
    return response.data;
};

export default FuncClient