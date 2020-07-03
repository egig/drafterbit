import EventEmitter from 'eventemitter3';
import apiClient from './apiClient';
import getConfig from './getConfig';
import axios from 'axios';
import React from 'react';
import FuncClient from './apiClient/FuncClient';

class Drafterbit extends EventEmitter {

    modules = [];
    getConfig = getConfig;

    addModule(moduleObject) {
        this.modules.push(moduleObject)
    }

    initApiClient() {

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

    getApiClient() {
        return this.apiClient2;
    }
}

export default Drafterbit