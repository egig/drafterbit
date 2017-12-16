import axios from 'axios';

const setUser = (user) => {
    return {
        type: 'AUTH_SET_USER',
        payload: user
    };
};

const doLogin = (email, password) => (dispatch) => {

    return axios.post('/api/user/login', {
        email,
        password
    }).then(response => {
        return dispatch(setUser(response.data));
    });
};

export default {
    doLogin
};