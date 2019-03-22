import apiClient from '../../apiClient';
import {SET_CONTENT_TYPE, SET_CONTENT_TYPES} from './action_types';


const setContentTypes = (contentTypes) => {
    return {
        type: SET_CONTENT_TYPES,
        payload: contentTypes
    };
};

const setContentType = (contentType) => {
    return {
        type: SET_CONTENT_TYPE,
        payload: contentType
    };
};

const setAjaxLoading = (isLoading) => {
    return {
        type: '@common/SET_AJAX_LOADING',
        payload: isLoading
    };
};


const getContentTypes = () => (dispatch) => {

    console.log('getContentTypes in ACTIONS');

    let client = apiClient.createClient({});
    client.getContentTypes()
        .then((contentTypes) => {
    	console.log(contentTypes);
            return dispatch(setContentTypes(contentTypes));
        });
};

const getContentType = (contentTypeId) => (dispatch) => {
    let client = apiClient.createClient({});
    client.getContentType(contentTypeId)
        .then((contentType) => {
            return dispatch(setContentType(contentType));
        });
};

const createContentType = (name, slug, description, projectId, fields) => (dispatch) => {

    dispatch(setAjaxLoading(true));

    let client = apiClient.createClient({});
    return client.createContentType(name, slug, description, projectId, fields)
        .then((ct) => {
            dispatch(setAjaxLoading(false));

        });
};

const deleteContentType = (contentTypeId) => (dispatch) => {

    dispatch(setAjaxLoading(true));

    // TODO create dt client singleton
    let client = apiClient.createClient({});
    return client.deleteContentType(contentTypeId)
        .then((project) => {
            return dispatch(setAjaxLoading(false));
        });
};


const updateContentType = (contentTypeId, name, slug, description) => (dispatch) => {
    dispatch(setAjaxLoading(true));

    let client = apiClient.createClient({});
    return client.updateContentType(contentTypeId, name, slug, description)
        .then((project) => {
            return dispatch(setAjaxLoading(false));
        });
};


export default {
    getContentTypes,
    getContentType,
    createContentType,
    deleteContentType,
    updateContentType
};