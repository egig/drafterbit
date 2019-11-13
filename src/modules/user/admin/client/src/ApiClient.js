import axios from 'axios';
import handleAxiosError from './handleAxiosError';

class ApiClient {

    constructor(axiosInstance) {
        this.axiosInstance = axiosInstance;
    }

    async getUsers() {
        let response = await this.axiosInstance.get('/users');
        return response.data;
    }

    async createUserSession(email, password) {
        try {

            let response = await this.axiosInstance.post('/token', {
                email, password
            });
            return response.data;

        } catch (error) {
            handleAxiosError(error);
        }
    }

    async validateToken(token) {
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
    }

    async createUser(name, email, password) {
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