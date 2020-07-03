const ApiClient = {

    getFiles: async function getFiles(path) {
        let response = await this.axiosInstance.get('/files', {
            params: {
                op: 'ls',
                path
            }
        });
        return response.data;
    },

    upload: async function upload(file, path) {
        let formData = new FormData();
        formData.set('path', path);
        formData.append('f', file);

        let res = await  this.axiosInstance.put('/files', formData, {
            headers: {'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    }
};

export default ApiClient;