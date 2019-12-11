import ApiClient from './ApiClient';

const setAjaxLoading = (isLoading) => {
    return {
        type: '@common/SET_AJAX_LOADING',
        payload: isLoading
    };
};

const setApiKeys = (contentTypes) => {
    return {
        type: '@api_key/SET_API_KEYS',
        payload: contentTypes
    };
};


const getApiKeys = () => (dispatch) => {
    let client = new ApiClient();
    client.getApiKeys()
        .then((apiKeys) => {
            return dispatch(setApiKeys(apiKeys));
        });
};

const createApiKey = ( name, key, restrictionType, restrictionValue) => (dispatch) => {
    dispatch(setAjaxLoading(true));


    let client = new ApiClient();    
    return client.createApiKey( name, key, restrictionType, restrictionValue)
        .then(() => {
            return     dispatch(setAjaxLoading(false));
        });
};

export default {
    getApiKeys,
    createApiKey
};