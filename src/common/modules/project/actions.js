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



const getContentTypes = (projectId) => (dispatch) => {
	let client = drafterbit.createClient({});
	client.getContentTypes(projectId)
		.then((contentTypes) => {
			return dispatch(setContentTypes(contentTypes))
		});
};

const getProject = (projectId) => (dispatch) => {
	let client = drafterbit.createClient({});
	client.getProject(projectId)
		.then((project) => {
			return dispatch(setProject(project))
		});
};

export default {
	getProject,
	getContentTypes
};