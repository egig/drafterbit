const ApiClient = {

    getFieldTypes: async function getFieldTypes() {
        let response = await this.axiosInstance.get('/field_types');
        return response.data;
    },

    getContentTypes: async function getContentTypes() {
        return this._doGetRequest('/types');
    },

    getContentType: async function getContentType(contentTypeId) {
        return this._doGetRequest(`/types/${contentTypeId}`);
    },

    createContentType: async function createContentType(name, slug, description, fields=[]) {
        return this._doPostRequest('/types', {
            name,
            slug,
            description,
            fields,
        });
    },

    createType: async function createType(name, slug, display_text, description, fields=[]) {
        return this._doPostRequest('/types', {
            name,
            slug,
            display_text,
            description,
            fields,
        });
    },

    deleteContentType: async function deleteContentType(contentTypeId) {
        let response = await this.axiosInstance.delete(`/types/${contentTypeId}`);
        return response.data;
    },

    updateContentType: async function updateContentType(contentTypeId, name, slug, description, fields) {
        let response = await this.axiosInstance.patch(`/types/${contentTypeId}`, {
            name, slug, description, fields
        });
        return response.data;
    },

    updateType: async function updateType(typeId, payload) {
        let response = await this.axiosInstance.patch(`/types/${typeId}`, payload);
        return response.data;
    },

    updateContentTypeField: async function updateContentTypeField(contentTypeId, fieldId, label, name, relatedContentTypeSlug, validationRules, showInList)  {
        let url = `/types/${contentTypeId}/fields/${fieldId}`;
        let response = await this.axiosInstance.patch(url, {
            label, name,
            related_content_type_slug: relatedContentTypeSlug,
            validation_rules: validationRules,
            show_in_list: showInList
        });
        return response.data;
    },

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
    addContentTypeField: async function addContentTypeField(contentTypeId, label, name, typeId, relatedContentTypeSlug, validationRules, showInList)  {
        let url = `/types/${contentTypeId}/fields`;
        let response = await this.axiosInstance.post(url, {
            label,
            name,
            type_id: typeId,
            related_content_type_slug: relatedContentTypeSlug,
            validation_rules: validationRules,
            show_in_list: showInList
        });
        return response.data;
    },

    getContentTypeFields: async function getContentTypeFields(slug, page) {
        let response = await this.axiosInstance.get(`/types/${slug}`);
        return response.data;
    },

    createDraft: async function createDraft(slug) {
        let response = await this.axiosInstance.post(`/${slug}`, {});
        return response.data;
    },

    getEntries: async function getEntries(slug, page, sortBy, sortDir, fqSr) {
        return this.axiosInstance.get(`/${slug}`, {
            params: {
                page,
                sort_by: sortBy,
                sort_dir: sortDir,
                fq: fqSr
            }
        });
    },

    getEntry: async function getEntry(slug, entryId) {
        let response = await this.axiosInstance.get(`/${slug}/${entryId}`);
        return response.data;
    },

    updateEntry: async function updateEntry(slug, entryId, data) {
        let response = await this.axiosInstance.patch(`/${slug}/${entryId}`, data);
        return response.data;
    },

    deleteEntry: async function deleteEntry(slug, entryId) {
        let response = await this.axiosInstance.delete(`${slug}/${entryId}`);
        return response.data;
    },

    createContent: async function createContent(contentTypeId, fields) {
        let response = await this.axiosInstance.post(`/types/${contentTypeId}/contents`, {
            fields: fields
        });
        return response.data;
    },

    updateContent: async function updateContent(contentId, fields) {
        let response = await this.axiosInstance.patch(`/contents/${contentId}`, {
            fields: fields
        });
        return response.data;
    },

    deleteContent: async function deleteContent(contentId) {
        let response = await this.axiosInstance.delete(`/contents/${contentId}`);
        return response.data;
    },

    getContents: async function getContents(contentTypeId, page, sortBy, sortDir, fqSr) {
    	return this.axiosInstance.get(`/types/${contentTypeId}/contents`, {
            params: {
                page,
                sort_by: sortBy,
                sort_dir: sortDir,
                fq: fqSr
            }
        });
    },

    getContent: async function getContent(contentId) {
        let response = await this.axiosInstance.get(`/contents/${contentId}`);
        return response.data;
    }
}

export default ApiClient;