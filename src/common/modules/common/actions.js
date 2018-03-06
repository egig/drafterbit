import drafterbit from 'drafterbit';

const setProjects = (projects) => {
	return {
		type: '@project/SET_PROJECTS',
		payload: projects
	};
};


const getProjects = (userId) => (dispatch) => {
	let client = drafterbit.createClient({});
	client.getProjects(userId)
		.then((projects) => {
			return dispatch(setProjects(projects))
		});
};

export default {
	getProjects
};