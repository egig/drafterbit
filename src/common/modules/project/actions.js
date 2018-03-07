import drafterbit from 'drafterbit';

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


const getContentTypes = (projectId) => (dispatch) => {
	let client = drafterbit.createClient({});
	client.getContentTypes(projectId)
		.then((contentTypes) => {
			return dispatch(setContentTypes(contentTypes))
		});
};

const getContentType = (contentTypeId) => (dispatch) => {
	let client = drafterbit.createClient({});
	client.getContentType(contentTypeId)
		.then((contentType) => {
			return dispatch(setContentType(contentType))
		});
};

const getProject = (projectId) => (dispatch) => {
	let client = drafterbit.createClient({});
	client.getProject(projectId)
		.then((project) => {
			return dispatch(setProject(project))
		});
};

const createProject = (projectName, projectDescription, userId) => (dispatch) => {
	let client = drafterbit.createClient({});
	return client.createProject(projectName, projectDescription, userId)
		.then((project) => {
			return dispatch(setProject(project))
		});
};

export default {
	getProject,
	getContentTypes,
	getContentType,
	createProject
};