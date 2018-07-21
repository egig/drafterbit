import apiClient from '../../../apiClient';

const setAjaxLoading = (isLoading) => {
	return {
		type: '@common/SET_AJAX_LOADING',
		payload: isLoading
	};
};

const setApiKeys = (contentTypes) => {
	return {
		type: '@project/SET_API_KEYS',
		payload: contentTypes
	};
};


const getApiKeys = (projectId) => (dispatch) => {
	let client = apiClient.createClient({});
	client.getApiKeys(projectId)
		.then((apiKeys) => {
			return dispatch(setApiKeys(apiKeys))
		});
};

const createApiKey = (projectId, name, key, restrictionType, restrictionValue) => (dispatch) => {
	dispatch(setAjaxLoading(true));


	let client = apiClient.createClient({});
	return client.createApiKey(projectId, name, key, restrictionType, restrictionValue)
		.then((project) => {
			return 	dispatch(setAjaxLoading(false));
		});
};

export default {
	getApiKeys,
	createApiKey
};