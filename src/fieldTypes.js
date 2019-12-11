const FIELD_SHORT_TEXT = 1;
const FIELD_LONG_TEXT = 2;
const FIELD_RICH_TEXT = 3;
const FIELD_RELATION_TO_ONE = 4;
const FIELD_RELATION_TO_MANY = 5;
const FIELD_NUMBER = 6;

// With  dynamic field, user can edit add or remove content type freely,
// semi unstructured using Medium like editor (slate.js)
const FIELD_UNSTRUCTURED = 7;
const FIELD_IMAGE = 8;
const FIELD_VIDEO = 9;
const FIELD_DATE = 10;
const FIELD_LOCATION = 11;
const FIELD_TOGGLE = 12;

// TODO any change to translate the name
const fieldTypes = [
    {
        id: FIELD_SHORT_TEXT,
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
        id: FIELD_LONG_TEXT,
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
        id: FIELD_RICH_TEXT,
        code: 'FIELD_RICH_TEXT',
        name: 'Rich Text',
        validationOptions: [
            'is_required',
            'min_length',
            'max_length',
        ]
    },
    {
        id: FIELD_RELATION_TO_ONE,
        code: 'FIELD_RELATION_TO_ONE',
        name: 'Relation to One',
        validationOptions: [
            'is_required',
            'unique',
        ]
    },
    {
        id: FIELD_RELATION_TO_MANY,
        code: 'FIELD_RELATION_TO_MANY',
        name: 'Relation to Many',
        validationOptions: [
            'is_required',
        ]
    },
    {
        id: FIELD_NUMBER,
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
        id: FIELD_UNSTRUCTURED,
        code: 'FIELD_UNSTRUCTURED',
        name: 'Unstructured',
        validationOptions: []
    }
];

function getFieldTypesObject() {
    let fieldTypeObject = {};
    fieldTypes.map(f => {
        fieldTypeObject[f.id] = f.name;
    });
    return fieldTypeObject;
}

function getFieldTypeName(id) {
    return getFieldTypesObject()[id];
}

function getFieldTypes() {
    return fieldTypes;
}

function getFieldTypesByKeys() {
    let fieldTypeObject = {};
    fieldTypes.map(f => {
        fieldTypeObject[f.id] = f;
    });
    return fieldTypeObject;
}


function getFieldType(id) {
    return getFieldTypesByKeys()[id];
}

module.exports = {
    FIELD_NUMBER,
    FIELD_RELATION_TO_ONE,
    FIELD_RELATION_TO_MANY,
    FIELD_RICH_TEXT,
    FIELD_LONG_TEXT,
    FIELD_SHORT_TEXT,
    FIELD_UNSTRUCTURED,
    getFieldTypeName,
    getFieldTypes,
    getFieldType
};