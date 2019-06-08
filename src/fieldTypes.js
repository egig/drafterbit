export const FIELD_SHORT_TEXT = 1;
export const FIELD_LONG_TEXT = 2;
export const FIELD_RICH_TEXT = 3;
export const FIELD_RELATION_TO_ONE = 4;
export const FIELD_RELATION_TO_MANY = 5;
export const FIELD_NUMBER = 6;

const fieldTypes = [
    {
        id: FIELD_SHORT_TEXT,
        name: 'Short Text',
    },
    {
        id: FIELD_LONG_TEXT,
        name: 'Long Text',
    },
    {
        id: FIELD_RICH_TEXT,
        name: 'Rich Text'
    },
    {
        id: FIELD_RELATION_TO_ONE,
        name: 'Relation to One'
    },
    {
        id: FIELD_RELATION_TO_MANY,
        name: 'Relation to Many'
    },
    {
        id: FIELD_NUMBER,
        name: 'Number'
    }
];

function getFieldTypesObject() {
    let fieldTypeObject = {};
    fieldTypes.map(f => {
        fieldTypeObject[f.id] = f.name;
    });
    return fieldTypeObject;
}

export function getFieldTypeName(id) {
    return getFieldTypesObject()[id];
}

export function getFieldTypes() {
    return fieldTypes;
}