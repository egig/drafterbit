import drafterbit from 'drafterbit';

const setProject = (projects) => {
	return {
		type: '@project/SET_PROJECT',
		payload: projects
	};
};


const getProject = (projectId) => (dispatch) => {
	let client = drafterbit.createClient({});
	client.getProject(projectId)
		.then((project) => {
			return dispatch(setProject(project))
		});
};

export default {
	getProject
};