import EventEmitter from 'eventemitter3';
import apiClient from './apiClient';
import getConfig from './getConfig';
import getProject from './getProject';

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

    userApiClient = apiClient.createUserApiClient({
        baseURL: getConfig('userApiBaseURL'),
        apiKey: getConfig('userApiKey')
    })

    addModule(moduleObject) {
        this.modules.push(moduleObject)
    }
}

const drafterbit = new Drafterbit()
window.__DRAFTERBIT__ = drafterbit;

export default drafterbit


