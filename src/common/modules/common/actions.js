import drafterbit from 'drafterbit';


const setProjects = (projects) => {
	return {
		type: 'PROJECT_SET',
		payload: projects
	};
};


const getProjects = () => (dispatch) => {
	let client = drafterbit.createClient({});
	client.getProjects()
		.then((projects) => {
			console.log(projects);
			return dispatch(setProjects(projects))
		});
};

export default {
	getProjects
};