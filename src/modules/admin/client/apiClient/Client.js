import axios from 'axios';
import handleAxiosError from './handleAxiosError';

class Client {

    constructor(options) {

        let axiosInstance = axios.create({
            baseURL: options.baseURL,
            timeout: 10000,
            params: {
                api_key: 'test'
            }
        });

        this.options = Object.assign({}, {
            project_id: null,
            access_token: null
        }, options);

        this.axiosInstance = axiosInstance;
    }

    // async createProject(projectName, projectDescription, userId) {
    //     let response = await this.axiosInstance.post(`/users/${userId}/projects`, {
    //         name: projectName,
    //         description: projectDescription
    //     });
    //     return response.data;
    // }

    // async updateProject(projectId, projectName, projectDescription) {
    //     let response = await this.axiosInstance.patch(`/projects/${projectId}`, {
    //         name: projectName,
    //         description: projectDescription
    //     });
    //     return response.data;
    // }
    //
    // async deleteProject(projectId) {
    //     let response = await this.axiosInstance.delete(`/projects/${projectId}`);
    //     return response.data;
    // }
    //
    // async getProjects(userId) {
    //     userId = userId || this.getCurrentUserId();
    //     let response = await this.axiosInstance.get(`/users/${userId}/projects`);
    //     return response.data;
    // }
    //
    // async getProject(projectId) {
    //     let response = await this.axiosInstance.get(`/projects/${projectId}`);
    //     return response.data;
    // }

    // async getProjectStat(projectId) {
    //     let response = await this.axiosInstance.get(`/projects/${projectId}/stat`);
    //     return response.data;
    // }

    async getUsers() {
        let response = await this.axiosInstance.get('/users');
        return response.data;
    }

    async getContentTypes() {
        let response = await this.axiosInstance.get('/content_types');
        return response.data;
    }

    async getContentType(contentTypeId) {
        let response = await this.axiosInstance.get(`/content_types/${contentTypeId}`);
        return response.data;
    }

    async createUserSession(email, password) {
        try {

            let response = await this.axiosInstance.post('/users/session', {
                email, password
            });
            return response.data;

        } catch (error) {
            handleAxiosError(error);
        }
    }

    async createUser(first_name, last_name, email, password) {
        try {

            let response = await this.axiosInstance.post('/users', {
                first_name, last_name, email, password
            });
            return response.data;

        } catch (error) {
            handleAxiosError(error);
        }
    }

    async getApiKeys() {
        let response = await this.axiosInstance.get('/api_keys');
        return response.data;
    }

    async getApiKey(apiKeyId) {
        let response = await this.axiosInstance.get(`/api_keys/${apiKeyId}`);
        return response.data;
    }

    async createContentType(name, slug, description, fields) {
        let response = await this.axiosInstance.post('/content_types', {
            name,
            slug,
            description,
            fields,
        });
        return response.data;
    }

    async deleteContentType(contentTypeId) {
        let response = await this.axiosInstance.delete(`/content_types/${contentTypeId}`);
        return response.data;
    }

    async updateContentType(contentTypeId, name, slug, description, fields) {
        let response = await this.axiosInstance.patch(`/content_types/${contentTypeId}`, {
            name, slug, description, fields
        });
        return response.data;
    }

    async getContentTypeFields(slug, page) {
        let response = await this.axiosInstance.get(`/content_types/${slug}`);
        return response.data;
    }

    async createContent(slug, fields) {
        let response = await this.axiosInstance.post(`/${slug}`, fields);
        return response.data;
    }

    async updateContent(slug, contentId, fields) {
        let response = await this.axiosInstance.patch(`/${slug}/${contentId}`, fields);
        return response.data;
    }

    async deleteContent(ctSlug, contentId) {
        let response = await this.axiosInstance.delete(`/${ctSlug}/${contentId}`);
        return response.data;
    }

    async getContents(slug, page, sortBy, sortDir, fqSr) {
    	return await this.axiosInstance.get(`/${slug}`, {
	        params: {
		        page,
		        sort_by: sortBy,
		        sort_dir: sortDir,
		        fq: fqSr
	        }
        });
    }

    async getContent(ctSlug, contentId) {
        let response = await this.axiosInstance.get(`/${ctSlug}/${contentId}`);
        return response.data;
    }

    async createApiKey(name, key, restrictionType, restrictionValue) {
        let response = await this.axiosInstance.post('/api_keys', {
            name,
            key,
            restriction_type: restrictionType,
            restriction_value: restrictionValue
        });

        return response.data;
    }

    async updateApiKey(apiKeyId, name, key, restrictionType, restrictionValue) {
        let response = await this.axiosInstance.patch(`/api_keys/${apiKeyId}`, {
            apiKeyId, name, key, restriction_type: restrictionType, restriction_value: restrictionValue
        });
        return response.data;
    }
}

export default Client;