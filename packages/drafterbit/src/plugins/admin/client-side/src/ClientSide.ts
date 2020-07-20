import EventEmitter from 'eventemitter3';
import ApiClient from './ApiClient';
import Module from './Module';
import { combineReducers } from 'redux';
import { createStore, applyMiddleware } from  'redux';
import thunk from 'redux-thunk';
import i18next from 'i18next';

class ClientSide extends EventEmitter {

    config: any;
    modules: any[];
    store: any;
    i18n: any;
    languageContext: any;
    apiClient: any;

    constructor(config: Object) {
        super();

        this.config = config;
        this.modules = [];
        this.store = null;

        this.i18n = i18next.createInstance();
        this.i18n.init({
            lng: 'id',
            fallbackLng: 'en',
            debug: !!parseInt(this.getConfig("debug")),
            resources: [],
        } as any);
        this.languageContext =  {namespaces: [], i18n: this.i18n};
    }

    getConfig(name: string) {
        if(!this.config.hasOwnProperty(name)) {
            throw new Error(`Can not find config value for: ${name}`);
        }

        return this.config[name];
    };

    addModule(moduleProto: Object) {
        function M() {}
        M.prototype = Object.assign({}, Module.prototype, moduleProto);
        // @ts-ignore
        let moduleObject = new M();
        this.modules.push(moduleObject);
    }

    initApiClient() {

        let clientProto = {};
        this.modules.map(m => {
            clientProto = Object.assign({}, clientProto, m.registerApiClient())
        });


        ApiClient.prototype  = Object.assign({}, ApiClient.prototype, clientProto);
        let options = {
            baseURL: this.getConfig('apiBaseURL'),
            apiKey: this.getConfig('apiKey')
        };

        this.apiClient = new ApiClient(options);
    }

    getApiClient() {
        return this.apiClient;
    }

    createRootReducer(): any {
        let reducerMap = {};
        this.modules.map(mo => {
            if(mo.stateReducer) {
                (reducerMap as any)[mo.stateReducer.stateName] = mo.stateReducer.reducer;
            }
        });

        return combineReducers(reducerMap);
    }

    storeFromState(defaultState: Object) {
        const middleWares = [thunk];
        this.store = createStore(this.createRootReducer(), defaultState, applyMiddleware(...middleWares));;
    }

    createDefaultState() {

        let defaultState = {};

        this.modules.map(mo => {
            if(mo.stateReducer) {
                (defaultState as any)[mo.stateReducer.stateName] = mo.stateReducer.defaultState;
            }
        });

        return defaultState;
    }
}

export default ClientSide