import apiClient from './apiClient';
import getConfig from './getConfig';
import getProject from './getProject';
import EventEmitter from 'eventemitter3';

class Drafterbit extends EventEmitter {
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
}

const drafterbit = new Drafterbit()

export default drafterbit


