class FieldType {
    static SHORT_TEXT = 1;
    static LONG_TEXT = 2;
    static RICH_TEXT = 3;
    static RELATION_TO_ONE = 4;
    static RELATION_TO_MANY = 5;
    static NUMBER = 6;
    static UNSTRUCTURED = 7;
    static IMAGE = 8;
    static VIDEO = 9;
    static DATE = 10;
    static LOCATION = 11;
    static TOGGLE = 12;

    static fieldTypes = [
        {
            id: FieldType.SHORT_TEXT,
            code: 'FIELD_SHORT_TEXT',
            name: 'Short Text',
            validationOptions: [
                'is_required',
                'unique',
                'min_length',
                'max_length',
            ]
        },
        {
            id: FieldType.LONG_TEXT,
            code: 'FIELD_LONG_TEXT',
            name: 'Long Text',
            validationOptions: [
                'is_required',
                'unique',
                'min_length',
                'max_length',
            ]
        },
        {
            id: FieldType.RICH_TEXT,
            code: 'FIELD_RICH_TEXT',
            name: 'Rich Text',
            validationOptions: [
                'is_required',
                'min_length',
                'max_length',
            ]
        },
        {
            id: FieldType.RELATION_TO_ONE,
            code: 'FIELD_RELATION_TO_ONE',
            name: 'Relation to One',
            validationOptions: [
                'is_required',
                'unique',
            ]
        },
        {
            id: FieldType.RELATION_TO_MANY,
            code: 'FIELD_RELATION_TO_MANY',
            name: 'Relation to Many',
            validationOptions: [
                'is_required',
            ]
        },
        {
            id: FieldType.NUMBER,
            code: 'FIELD_NUMBER',
            name: 'Number',
            validationOptions: [
                'is_required',
                'unique',
                'min',
                'max',
            ]
        },
        {
            id: FieldType.UNSTRUCTURED,
            code: 'FIELD_UNSTRUCTURED',
            name: 'Unstructured',
            validationOptions: []
        }
    ];

    static asMap() {
        return FieldType.fieldTypes.reduce((o, f) => {
            o[f.id] = f.name;
            return o
        }, {});
    }

    static asObject() {
        return FieldType.fieldTypes.reduce((o, f) => {
            o[f.id] = f;
            return o
        }, {});
    }

    static getTypeName(id) {
        return FieldType.asMap()[id];
    }

    static get(id) {
        return FieldType.asObject()[id];
    }
}

module.exports = FieldType;