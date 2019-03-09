import apiClient from '../../apiClient';

const setProjects = (projects) => {
    return {
        type: '@project/SET_PROJECTS',
        payload: projects
    };
};


const getProjects = (userId) => (dispatch) => {
    let client = apiClient.createClient({});
    client.getProjects(userId)
        .then((projects) => {
            return dispatch(setProjects(projects));
        });
};

export default {
    getProjects
};