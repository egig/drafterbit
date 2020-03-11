import axios from 'axios';

class Client {

    constructor(options) {

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

    async _doGetRequest(path) {
        let response = await this.axiosInstance.get(`${path}`);
        return response.data;
    }

    async _doPostRequest(path, data) {
        let response = await this.axiosInstance.post(`${path}`, data);
        return response.data;
    }
}

export default Client;