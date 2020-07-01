import EventEmitter from 'eventemitter3';
import apiClient from './apiClient';
import getConfig from './getConfig';
import axios from 'axios';
import React from 'react';

class Drafterbit extends EventEmitter {

    modules = [];
    getConfig = getConfig;
    getApiClient () {
        if(!this.apiClient) {
            this.apiClient =  apiClient.createClient({
                baseURL: getConfig('apiBaseURL'),
                apiKey: getConfig('apiKey')
            });
        }
        return this.apiClient;
    }

    getAxiosInstance() {
        let apiClientOptions = {
            baseURL: getConfig('apiBaseURL'),
            timeout: 10000,
            params: {
                api_key: getConfig('apiKey')
            }
        };

        return axios.create(apiClientOptions);
    }

    addModule(moduleObject) {
        this.modules.push(moduleObject)
    }
}

export default Drafterbit