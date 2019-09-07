import axios from 'axios';
import handleAxiosError from './handleAxiosError';

class Client {

    constructor(options) {

        let axiosInstance = axios.create({
            baseURL: options.baseURL,
            timeout: 10000,
            params: {
                api_key: options.apiKey
            }
        });

        this.options = Object.assign({}, {
            project: null,
            access_token: null
        }, options);

        this.axiosInstance = axiosInstance;
    }

    async _doGetRequest(path) {
        let response = await this.axiosInstance.get(`${path}`);
        return response.data;
    }

    async _doPostRequest(path, data) {
        let response = await this.axiosInstance.post(`${path}`, data);
        return response.data;
    }

    async getFieldTypes() {
        let response = await this.axiosInstance.get(`/field_types`);
        return response.data;
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

    async getContentTypes() {
        return this._doGetRequest('/content_types');
    }

    async getContentType(contentTypeId) {
        return this._doGetRequest(`/content_types/${contentTypeId}`);
    }

    async getApiKeys() {
        return this._doGetRequest('/api_keys');
    }

    async getApiKey(apiKeyId) {
        return this._doGetRequest(`/api_keys/${apiKeyId}`);
    }

    async createContentType(name, slug, description, fields=[]) {
        return this._doPostRequest('/content_types', {
            name,
            slug,
            description,
            fields,
        });
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

    async updateContentTypeField(contentTypeId, fieldId, label, name, relatedContentTypeSlug, validationRules)  {
        let url = `/content_types/${contentTypeId}/fields/${fieldId}`;
        let response = await this.axiosInstance.patch(url, {
            label, name,
            related_content_type_slug: relatedContentTypeSlug,
            validation_rules: validationRules
        });
        return response.data;
    }

    /**
     * 
     * @param {*} contentTypeId 
     * @param {*} label 
     * @param {*} name 
     * @param {*} relatedContentTypeSlug 
     * @param {*} validationRules 
     */
    async addContentTypeField(contentTypeId, label, name, typeId, relatedContentTypeSlug, validationRules)  {
        let url = `/content_types/${contentTypeId}/fields`;
        let response = await this.axiosInstance.post(url, {
            label,
            name,
            type_id: typeId,
            related_content_type_slug: relatedContentTypeSlug,
            validation_rules: validationRules
        });
        return response.data;
    }

    async getContentTypeFields(slug, page) {
        let response = await this.axiosInstance.get(`/content_types/${slug}`);
        return response.data;
    }

    async createDraft(slug) {
        let response = await this.axiosInstance.post(`/content_types/${slug}`, {});
        return response.data;
    }

    async getEntries(slug, page, sortBy, sortDir, fqSr) {
        return await this.axiosInstance.get(`/entries/${slug}`, {
            params: {
                page,
                sort_by: sortBy,
                sort_dir: sortDir,
                fq: fqSr
            }
        });
    }

    async getEntry(slug, entryId) {
         let response = await this.axiosInstance.get(`/${slug}/${entryId}`);
         return response.data;
    }

    async updateEntry(slug, entryId, data) {
        let response = await this.axiosInstance.patch(`/${slug}/${entryId}`, data);
        return response.data;
    }

    async deleteEntry(slug, entryId) {
        let response = await this.axiosInstance.delete(`${slug}/${entryId}`);
        return response.data;
    }

    async createContent(contentTypeId, fields) {
        let response = await this.axiosInstance.post(`/content_types/${contentTypeId}/contents`, {
            fields: fields
        });
        return response.data;
    }

    async updateContent(contentId, fields) {
        let response = await this.axiosInstance.patch(`/contents/${contentId}`, {
            fields: fields
        });
        return response.data;
    }

    async deleteContent(contentId) {
        let response = await this.axiosInstance.delete(`/contents/${contentId}`);
        return response.data;
    }

    async getContents(contentTypeId, page, sortBy, sortDir, fqSr) {
    	return await this.axiosInstance.get(`/content_types/${contentTypeId}/contents`, {
	        params: {
		        page,
		        sort_by: sortBy,
		        sort_dir: sortDir,
		        fq: fqSr
	        }
        });
    }

    async getContent(contentId) {
        let response = await this.axiosInstance.get(`/contents/${contentId}`);
        return response.data;
    }

    async createApiKey(name, key, restrictionType, restrictionValue) {
        let response = await this.axiosInstance.post(`/api_keys`, {
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