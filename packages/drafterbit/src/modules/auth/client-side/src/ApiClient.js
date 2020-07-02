import handleAxiosError from './handleAxiosError';

const ApiClient = {

    getUsers: async function getUsers() {
        let response = await this.axiosInstance.get('/users');
        return response.data;
    },

    createUserSession: async function createUserSession(email, password) {
        try {

            let response = await this.axiosInstance.post('/token', {
                email, password
            });
            return response.data;

        } catch (error) {
            handleAxiosError(error);
        }
    },

    validateToken: async function validateToken(token) {
        try {

            let response = await this.axiosInstance.get('/token_validate', {
                params: {
                    token
                }
            });
            return response.data;

        } catch (error) {
            handleAxiosError(error);
        }
    },

    createUser: async function createUser(name, email, password) {
        try {

            let response = await this.axiosInstance.post('/users', {
                name, email, password
            });
            return response.data;

        } catch (error) {
            handleAxiosError(error);
        }
    }
}

export default ApiClient;