// TODO make this unified with Backend

// export const {
//     FIELD_SHORT_TEXT,
//     FIELD_LONG_TEXT,
//     FIELD_RICH_TEXT,
//     FIELD_RELATION_TO_ONE,
//     FIELD_RELATION_TO_MANY,
//     FIELD_NUMBER,
//     FIELD_UNSTRUCTURED
// } = window.__DT_CONST;

function getFieldTypesObject() {
    let fieldTypeObject = {};
    window.__DT_FIELD_TYPES.map(f => {
        fieldTypeObject[f.id] = f.name;
    });
    return fieldTypeObject;
}

function getFieldTypesByKeys() {
    let fieldTypeObject = {};
    window.__DT_FIELD_TYPES.map(f => {
        fieldTypeObject[f.id] = f;
    });
    return fieldTypeObject;
}

export function getFieldType(id) {
    return getFieldTypesByKeys()[id];
}

export function getFieldTypeName(id) {
    return getFieldTypesObject()[id];
}

export function getFieldTypes() {
    // We get this initially from server in index.js
    return window.__DT_FIELD_TYPES;
}