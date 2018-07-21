const axios = require("axios");
// TODO use config library nconf
const config = require('./../../config');
const handleAxiosError = require('./handleAxiosError');

class Client {

	constructor(options) {

		let axiosInstance = axios.create({
			baseURL: config.API_BASE_URL,
			timeout: 10000,
		});

		this.options = Object.assign({}, {
			project_id: null,
			access_token: null
		}, options);

		this.axiosInstance = axiosInstance;
	}

	getCurrentUserId() {
		// TODO get user id from current tokens
		return 0;
	}

	async createProject(projectName, projectDescription, userId) {
		let response = await this.axiosInstance.post(`/v1/users/${userId}/projects`, {
			name: projectName,
			description: projectDescription
		});
		return response.data;
	}

	async updateProject(projectId, projectName, projectDescription) {
		let response = await this.axiosInstance.patch(`/v1/projects/${projectId}`, {
			name: projectName,
			description: projectDescription
		});
		return response.data;
	}

	async deleteProject(projectId) {
		let response = await this.axiosInstance.delete(`/v1/projects/${projectId}`);
		return response.data;
	}

	async getProjects(userId) {
		userId = userId || this.getCurrentUserId();
		let response = await this.axiosInstance.get(`/v1/users/${userId}/projects`);
		return response.data;
	}

	async getProject(projectId) {
		let response = await this.axiosInstance.get(`/v1/projects/${projectId}`);
		return response.data;
	}

	async getProjectStat(projectId) {
		let response = await this.axiosInstance.get(`/v1/projects/${projectId}/stat`);
		return response.data;
	}

	async getContentTypes(projectId) {
		let response = await this.axiosInstance.get(`/v1/projects/${projectId}/content_types`);
		return response.data;
	}

	async getContentType(contentTypeId) {
		let response = await this.axiosInstance.get(`/v1/content_types/${contentTypeId}`);
		return response.data;
	}

	async createUserSession(email, password) {
		try {

			let response = await this.axiosInstance.post(`/v1/users/session`, {
				email, password
			});
			return response.data;

		} catch (error) {
			handleAxiosError(error);
		}
	}

	async createUser(first_name, last_name, email, password) {
		try {

			let response = await this.axiosInstance.post(`/v1/users`, {
				first_name, last_name, email, password
			});
			return response.data;

		} catch (error) {
			handleAxiosError(error);
		}
	}

	async getApiKeys(projectId) {
		let response = await this.axiosInstance.get(`/v1/projects/${projectId}/api_keys`);
		return response.data;
	}

	async getApiKey(apiKeyId) {
		let response = await this.axiosInstance.get(`/v1/api_keys/${apiKeyId}`);
		return response.data;
	}

	async createContentType(name, slug, description, projectId, fields) {
		let response = await this.axiosInstance.post(`/v1/projects/${projectId}/content_types`, {
			name,
			slug,
			description,
			fields,
		});
		return response.data;
	}

	async deleteContentType(contentTypeId) {
		let response = await this.axiosInstance.delete(`/v1/content_types/${contentTypeId}`);
		return response.data;
	}

	async updateContentType(contentTypeId, name, slug, description) {
		let response = await this.axiosInstance.patch(`/v1/content_types/${contentTypeId}`, {
			name, slug, description
		});
		return response.data;
	}

	async getContentTypeFields(projectId, slug) {
		let response = await this.axiosInstance.get(`/v1/projects/${projectId}/content_types/${slug}`);
		return response.data;
	}

	async createContent(contentTypeId, formData) {
		let response = await this.axiosInstance.post(`/v1/content_types/${contentTypeId}/contents`, {
			content: formData
		});
		return response.data;
	}

	async getContents(contentTypeId) {
		let response = await this.axiosInstance.get(`/v1/content_types/${contentTypeId}/contents`);
		return response.data;
	}

	async createApiKey(projectId, name, key, restrictionType, restrictionValue) {
		let response = await this.axiosInstance.post(`/v1/projects/${projectId}/api_keys`, {
			name,
			key,
			restriction_type: restrictionType,
			restriction_value: restrictionValue
		});

		return response.data;
	}

	async updateApiKey(apiKeyId, name, key, restrictionType, restrictionValue) {
		let response = await this.axiosInstance.patch(`/v1/api_keys/${apiKeyId}`, {
			apiKeyId, name, key, restrictionType, restrictionValue
		});
		return response.data;
	}
}

module.exports = Client;