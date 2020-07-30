const ApiClient = {

    getFieldTypes: async function getFieldTypes(): Promise<any> {
        // @ts-ignore
        let response = await this.axiosInstance.get('/field_types');
        return response.data;
    },

    getTypes: async function getTypes(params = {}): Promise<any> {
        // @ts-ignore
        let response = await this.axiosInstance.get('/types', {params});
        let count = response.headers['content-range'].split("/")[1];
        return {
            count,
            list: response.data
        };
    },

    getType: async function getType(typeName: string): Promise<any> {
        // @ts-ignore
        return this._doGetRequest(`/types/${typeName}`);
    },

    createType: async function createType(
        name: string, slug: string, display_text: string, description: string,
                                          has_fields: boolean, fields: any[]=[]): Promise<any> {
        // @ts-ignore
        return this._doPostRequest('/types', {
            name,
            slug,
            display_text,
            description,
            has_fields,
            fields,
        });
    },

    deleteType: async function deleteType(typeId: string) {
        // @ts-ignore
        let response = await this.axiosInstance.delete(`/types/${typeId}`);
        return response.data;
    },

    updateType: async function updateType(typeId: string, payload: any) {
        // @ts-ignore
        let response = await this.axiosInstance.patch(`/types/${typeId}`, payload);
        return response.data;
    },

    updateTypeField: async function updateTypeField(belongToTypeName: string, fieldId: string, payload: any)  {
        let url = `/types/${belongToTypeName}/fields/${fieldId}`;
        //@ts-ignore
        let response = await this.axiosInstance.patch(url, payload);
        return response.data;
    },

    addTypeField: async function addTypeField(belongsToTypeName: string, typeName: string,
                                              name: string, label: string, multiple: boolean, showInList: boolean, showInForm: boolean, validationRules: any)  {
        let url = `/types/${belongsToTypeName}/fields`;
        // @ts-ignore
        let response = await this.axiosInstance.post(url, {
            belongs_to_type_name: belongsToTypeName,
            name,
            label: label,
            type_name: typeName,
            multiple,
            show_in_form: showInForm,
            show_in_list: showInList,
            validation_rules: validationRules
        });
        return response.data;
    },

    createDraft: async function createDraft(typeName: string) {
        // @ts-ignore
        let response = await this.axiosInstance.post(`/${typeName}`, {});
        return response.data;
    },

    getEntries: async function getEntries(typeName: string, page: number,
                                          sortBy: string, sortDir: string, fqSr: string) {
        // @ts-ignore
        return this.axiosInstance.get(`/${typeName}`, {
            params: {
                page,
                sort_by: sortBy,
                sort_dir: sortDir,
                fq: fqSr
            }
        });
    },

    getEntry: async function getEntry(typeName: string, entryId: string) {
        // @ts-ignore
        let response = await this.axiosInstance.get(`/${typeName}/${entryId}`);
        return response.data;
    },

    updateEntry: async function updateEntry(typeName: string, entryId: string, data: any) {
        // @ts-ignore
        let response = await this.axiosInstance.patch(`/${typeName}/${entryId}`, data);
        return response.data;
    },

    deleteEntry: async function deleteEntry(typeName: string, entryId: string) : Promise<any> {
        // @ts-ignore
        let response = await this.axiosInstance.delete(`${typeName}/${entryId}`);
        return response.data;
    },
}

export default ApiClient;