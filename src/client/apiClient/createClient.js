const axios = require('axios');

module.exports = function createClient(options) {

    const instance = axios.create({
        baseURL: '/',
        timeout: 1000,
        headers: {'X-Custom-Header': 'foobar'}
    });
    
};