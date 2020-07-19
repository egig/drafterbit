import axios from 'axios';
import ApiClient from './ApiClient';

const setUser = (user) => {
    return {
        type: 'AUTH_SET_USER',
        payload: user
    };
};

const doLogin = (email, password) => (dispatch) => {

    return axios.post('/login', {
        email,
        password
    }).then(response => {
        return dispatch(setUser(response.data));
    });
};

const register = (first_name, last_name, email, password) => (dispatch) => {

    let client = new ApiClient({});
    return client
        .createUser(first_name, last_name, email, password)
        .then(response => {
            return;
            // return dispatch(setUser(response.data));
        });
};

export default {
    doLogin, register
};