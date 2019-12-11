import EventEmitter from 'eventemitter3';
import apiClient from './apiClient';
import getConfig from './getConfig';
import getProject from './getProject';
import axios from 'axios';
import reducer from 'drafterbit-module-content/admin/client/src/reducer';
import React from 'react';
import Dashboard  from './modules/common/components/Dashboard';

class Drafterbit extends EventEmitter {

    modules = [];
    getConfig = getConfig;
    getApiClient () {
        if(!this.apiClient) {
            this.apiClient =  apiClient.createClient({
                baseURL: getConfig('apiBaseURL'),
                apiKey: getConfig('apiKey'),
                project: getProject()
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

    userApiClient = apiClient.createUserApiClient({
        baseURL: getConfig('userApiBaseURL'),
        apiKey: getConfig('userApiKey')
    });

    addModule(moduleObject) {
        this.modules.push(moduleObject)
    }
}

const drafterbit = new Drafterbit();
window.__DRAFTERBIT__ = drafterbit;

export default drafterbit


