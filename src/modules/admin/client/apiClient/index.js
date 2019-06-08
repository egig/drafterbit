import Client from './Client';

export default {
    createClient: (options) => {
        return new Client(options);
    },
};