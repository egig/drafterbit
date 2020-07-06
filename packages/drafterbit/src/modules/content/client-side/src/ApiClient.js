const ApiClient = {

    getFieldTypes: async function getFieldTypes() {
        let response = await this.axiosInstance.get('/field_types');
        return response.data;
    },

    getTypes: async function getTypes(params = {}) {
        let response = await this.axiosInstance.get('/types', {params});
        return response.data;
    },

    getType: async function getType(typeName) {
        return this._doGetRequest(`/types/${typeName}`);
    },

    createType: async function createType(name, slug, display_text, description, has_fields, fields=[]) {
        return this._doPostRequest('/types', {
            name,
            slug,
            display_text,
            description,
            has_fields,
            fields,
        });
    },

    deleteType: async function deleteType(typeId) {
        let response = await this.axiosInstance.delete(`/types/${typeId}`);
        return response.data;
    },

    updateType: async function updateType(typeId, payload) {
        let response = await this.axiosInstance.patch(`/types/${typeId}`, payload);
        return response.data;
    },

    updateTypeField: async function updateTypeField(belongToTypeName, fieldId, payload)  {
        let url = `/types/${belongToTypeName}/fields/${fieldId}`;
        let response = await this.axiosInstance.patch(url, payload);
        return response.data;
    },

    addTypeField: async function addTypeField(belongsToTypeName, typeName,
        name,displayText,multiple, showInList, showInForm)  {
        let url = `/types/${belongsToTypeName}/fields`;
        let response = await this.axiosInstance.post(url, {
            belongs_to_type_name: belongsToTypeName,
            name,
            display_text: displayText,
            type_name: typeName,
            multiple,
            show_in_form: showInForm,
            show_in_list: showInList
        });
        return response.data;
    },

    createDraft: async function createDraft(typeName) {
        let response = await this.axiosInstance.post(`/${typeName}`, {});
        return response.data;
    },

    getEntries: async function getEntries(typeName, page, sortBy, sortDir, fqSr) {
        return this.axiosInstance.get(`/${typeName}`, {
            params: {
                page,
                sort_by: sortBy,
                sort_dir: sortDir,
                fq: fqSr
            }
        });
    },

    getEntry: async function getEntry(typeName, entryId) {
        let response = await this.axiosInstance.get(`/${typeName}/${entryId}`);
        return response.data;
    },

    updateEntry: async function updateEntry(typeName, entryId, data) {
        let response = await this.axiosInstance.patch(`/${typeName}/${entryId}`, data);
        return response.data;
    },

    deleteEntry: async function deleteEntry(typeName, entryId) {
        let response = await this.axiosInstance.delete(`${typeName}/${entryId}`);
        return response.data;
    },
}

export default ApiClient;