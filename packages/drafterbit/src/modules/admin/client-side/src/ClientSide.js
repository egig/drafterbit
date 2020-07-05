import EventEmitter from 'eventemitter3';
import getConfig from './getConfig';
import React from 'react';
import ApiClient from './ApiClient';
import { combineReducers } from 'redux';
import { createStore, applyMiddleware } from  'redux';
import thunk from 'redux-thunk';
import i18next from 'i18next';

const i18n = i18next.createInstance();
i18n.init({
    lng: 'id',
    fallbackLng: 'en',
    debug: !!parseInt(getConfig("debug")),
    resources: [],
});

class ClientSide extends EventEmitter {

    modules = [];
    store = [];
    languageContext =  {namespaces: [], i18n};
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


        ApiClient.prototype  = Object.assign({}, ApiClient.prototype, clientProto);
        let options = {
            baseURL: getConfig('apiBaseURL'),
            apiKey: getConfig('apiKey')
        };

        this.apiClient = new ApiClient(options);
    }

    getApiClient() {
        return this.apiClient;
    }

    createRootReducer() {
        let reducerMap = {};
        this.modules.map(mo => {
            if(mo.stateReducer) {
                reducerMap[mo.stateReducer.stateName] = mo.stateReducer.reducer;
            }
        });

        return combineReducers(reducerMap);
    }

    storeFromState(defaultState) {
        const middleWares = [thunk];
        this.store = createStore(this.createRootReducer(), defaultState, applyMiddleware(...middleWares));;
    }

    createDefaultState() {

        let defaultState = {};

        this.modules.map(mo => {
            if(mo.stateReducer) {
                defaultState[mo.stateReducer.stateName] = mo.stateReducer.defaultState;
            }
        });

        return defaultState;
    }
}

export default ClientSide