import apiClient from '../../../apiClient';

const setAjaxLoading = (isLoading) => {
	return {
		type: '@common/SET_AJAX_LOADING',
		payload: isLoading
	};
};

const setContentTypeField = (projects) => {
	return {
		type: '@content/SET_CT_FIELD',
		payload: projects
	};
};

const setContents = (contents) => {
	return {
		type: '@content/SET_CONTENTS',
		payload: contents
	};
};

const getContents = (contentTypeId) => (dispatch) => {
	let client = apiClient.createClient({});
	client.getContents(contentTypeId)
		.then((contents) => {
			return dispatch(setContents(contents))
		});
};


const getContentTypeFields = (projectId, ctSlug) => (dispatch) => {
	let client = apiClient.createClient({});
	return client.getContentTypeFields(projectId, ctSlug)
		.then((contentType) => {
			return dispatch(setContentTypeField(contentType))
		});
};


const createContent = (contentTypeId, formData) => (dispatch) => {

	dispatch(setAjaxLoading(true));

	let client = apiClient.createClient({});
	return client.createContent(contentTypeId, formData)
		.then((project) => {
			return dispatch(setAjaxLoading(false));
		});
};

export default {
	getContentTypeFields,
	createContent,
	getContents
};