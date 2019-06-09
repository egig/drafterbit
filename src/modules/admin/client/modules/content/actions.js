import apiClient from '../../apiClient';

const setAjaxLoading = (isLoading) => {
    return {
        type: '@common/SET_AJAX_LOADING',
        payload: isLoading
    };
};

const setContentTypeField = (ctFields) => {
    return {
        type: '@content/SET_CT_FIELD',
        payload: ctFields
    };
};

const setContents = (contents) => {
    return {
        type: '@content/SET_CONTENTS',
        payload: contents
    };
};

const setContent = (content) => {
    return {
        type: '@content/SET_CONTENT',
        payload: content
    };
};

const getContents = (contentTypeId, page) => (dispatch) => {
    let client = apiClient.createClient({});
    client.getContents(contentTypeId, page)
        .then((contents) => {
            return dispatch(setContents(contents));
        });
};

const getContent = (contentId) => (dispatch) => {
    let client = apiClient.createClient({});
    client.getContent(contentId)
        .then((content) => {
            return dispatch(setContent(content));
        });
};


const getContentTypeFields = (ctSlug) => (dispatch) => {
    let client = apiClient.createClient({});
    return client.getContentTypeFields(ctSlug)
        .then((contentType) => {
            return dispatch(setContentTypeField(contentType));
        });
};

const getCTFieldsAndGetContent = (ctSlug, contentId) => (dispatch) => {
    let client = apiClient.createClient({});
    return Promise.all([
        client.getContentTypeFields(ctSlug)
            .then((contentType) => {
                return dispatch(setContentTypeField(contentType));
            }),
        client.getContent(ctSlug, contentId)
            .then((content) => {
                return dispatch(setContent(content));
            })
    ]);
};


const createContent = (contentTypeSlug, formData) => (dispatch) => {

    dispatch(setAjaxLoading(true));

    let client = apiClient.createClient({});
    return client.createContent(contentTypeSlug, formData)
        .then((r) => {
            return dispatch(setAjaxLoading(false));
        });
};

const updateContent = (slug, id, formData) => (dispatch) => {

    dispatch(setAjaxLoading(true));

    let client = apiClient.createClient({});
    return client.updateContent(slug, id, formData)

	    .then((r) => {
            return dispatch(setAjaxLoading(false));
        });
};

const deleteContents = (ctSlug, contentIds) => (dispatch) => {

	  dispatch(setAjaxLoading(true));

	  let client = apiClient.createClient({});
    let deleteActionPromise = contentIds.map(contentId => {
        return client.deleteContent(ctSlug, contentId);
    });

    return Promise.all(deleteActionPromise)
	    .then((r) => {
		    return dispatch(setAjaxLoading(false));
	    });
};



export default{
    getContentTypeFields,
    createContent,
    updateContent,
    getContents,
    getContent,
    getCTFieldsAndGetContent,
    deleteContents
};