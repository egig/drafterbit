import {SET_CONTENT_TYPES} from './action_types';


const setContentTypes = (contentTypes) => {
    return {
        type: SET_CONTENT_TYPES,
        payload: contentTypes
    };
};

const setAjaxLoading = (isLoading) => {
    return {
        type: '@common/SET_AJAX_LOADING',
        payload: isLoading
    };
};

export const setNotifyText = (notifyText) => {

    console.log(notifyText);

    return {
        type: '@common/SET_NOTIFY_TEXT',
        payload: notifyText
    };
};

export const getContentTypes = (client) => (dispatch) => {

    client.getContentTypes()
        .then((contentTypes) => {
            return dispatch(setContentTypes(contentTypes));
        });
};


export default {
    setAjaxLoading
};