class ApiClient {

    constructor(axiosInstance) {
        this.axiosInstance = axiosInstance;
    }

    async getFiles(path) {
        let response = await this.axiosInstance.get('/files', {
            params: {
                op: 'ls',
                path
            }
        });
        return response.data;
    }
}

export default ApiClient