import Client from './Client';
import UserAPIClient from './UserAPIClient';

export default {
    createClient: (options) => {
        return new Client(options);
    },
    createUserApiClient: (options) => {
        return new UserAPIClient(options);
    }
};