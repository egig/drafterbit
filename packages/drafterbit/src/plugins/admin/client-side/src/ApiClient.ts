import axios from 'axios'

function ApiClient(options: {
    baseURL: string,
    apiKey: string
}) {

    let axiosInstance = axios.create({
        baseURL: options.baseURL,
        timeout: 10000,
        params: {
            api_key: options.apiKey
        }
    });

    // @ts-ignore
    this.options = Object.assign({}, {
        access_token: null
    }, options);

    // @ts-ignore
    this.axiosInstance = axiosInstance;
}

ApiClient.prototype._doGetRequest = async function _doGetRequest(path: string) {
    let response = await this.axiosInstance.get(`${path}`);
    return response.data;
};

ApiClient.prototype._doPostRequest = async function _doPostRequest(path: string, data: any) {
    let response = await this.axiosInstance.post(`${path}`, data);
    return response.data;
};

export = ApiClient