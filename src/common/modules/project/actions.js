import apiClient from '../../../apiClient';

const setProject = (projects) => {
	return {
		type: '@project/SET_PROJECT',
		payload: projects
	};
};

const setContentTypes = (contentTypes) => {
	return {
		type: '@project/SET_CONTENT_TYPES',
		payload: contentTypes
	};
};

const setContentType = (contentType) => {
	return {
		type: '@project/SET_CONTENT_TYPE',
		payload: contentType
	};
};

const setAjaxLoading = (isLoading) => {
	return {
		type: '@common/SET_AJAX_LOADING',
		payload: isLoading
	};
};


const getContentTypes = (projectId) => (dispatch) => {
	let client = apiClient.createClient({});
	client.getContentTypes(projectId)
		.then((contentTypes) => {
			return dispatch(setContentTypes(contentTypes))
		});
};

const getContentType = (contentTypeId) => (dispatch) => {
	let client = apiClient.createClient({});
	client.getContentType(contentTypeId)
		.then((contentType) => {
			return dispatch(setContentType(contentType))
		});
};

const getProject = (projectId) => (dispatch) => {
	let client = apiClient.createClient({});
	client.getProject(projectId)
		.then((project) => {
			return dispatch(setProject(project))
		});
};

const createProject = (projectName, projectDescription, userId) => (dispatch) => {
	let client = apiClient.createClient({});
	return client.createProject(projectName, projectDescription, userId)
		.then((project) => {
			return true;
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
	getProject,
	getContentTypes,
	getContentType,
	createProject,
	createContentType,
	deleteContentType,
	updateContentType
};