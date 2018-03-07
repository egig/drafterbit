import drafterbit from 'drafterbit';

const setApiKeys = (contentTypes) => {
	return {
		type: '@project/SET_API_KEYS',
		payload: contentTypes
	};
};


const getApiKeys = (projectId) => (dispatch) => {
	let client = drafterbit.createClient({});
	client.getApiKeys(projectId)
		.then((apiKeys) => {
			return dispatch(setApiKeys(apiKeys))
		});
};

export default {
	getApiKeys
};