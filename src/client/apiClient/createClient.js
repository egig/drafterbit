import axios from 'axios';

export default function createClient(options) {

    const instance = axios.create({
        baseURL: '/',
        timeout: 1000,
        headers: {'X-Custom-Header': 'foobar'}
    });
    
}