import drafterbit from 'drafterbit';

const setContentTypeField = (projects) => {
	return {
		type: '@content/SET_CT_FIELD',
		payload: projects
	};
};


const getContentTypeFields = (projectId, ctSlug) => (dispatch) => {
	let client = drafterbit.createClient({});
	client.getContentTypeFields(projectId, ctSlug)
		.then((contentType) => {
			return dispatch(setContentTypeField(contentType))
		});
};


export default {
	getContentTypeFields
};