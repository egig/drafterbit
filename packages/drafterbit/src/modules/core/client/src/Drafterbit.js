import EventEmitter from 'eventemitter3';
import apiClient from './apiClient';
import getConfig from './getConfig';
import axios from 'axios';
import React from 'react';
import FuncClient from './apiClient/FuncClient';

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

    initApiClient2() {

        let clientProto = {};
        this.modules.map(m => {
            if (typeof m.registerApiClient == "function") {
                clientProto = Object.assign({}, clientProto, m.registerApiClient())
            }
        });


        FuncClient.prototype  = Object.assign({}, FuncClient.prototype, clientProto);
        let options = {
            baseURL: getConfig('apiBaseURL'),
            apiKey: getConfig('apiKey')
        };

        this.apiClient2 = new FuncClient(options);
    }

    getApiClient2() {
        return this.apiClient2;
    }
}

export default Drafterbit