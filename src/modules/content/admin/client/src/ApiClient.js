class ApiClient {

    constructor(axiosInstance) {
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

    async getContentTypes() {
        return this._doGetRequest('/content_types');
    }

    async getContentType(contentTypeId) {
        return this._doGetRequest(`/content_types/${contentTypeId}`);
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
     * @param contentTypeId
     * @param label
     * @param name
     * @param typeId
     * @param relatedContentTypeSlug
     * @param validationRules
     * @returns {Promise<*>}
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
        let response = await this.axiosInstance.post(`/${slug}`, {});
        return response.data;
    }

    async getEntries(slug, page, sortBy, sortDir, fqSr) {
        return this.axiosInstance.get(`/${slug}`, {
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
    	return this.axiosInstance.get(`/content_types/${contentTypeId}/contents`, {
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
}

export default ApiClient;