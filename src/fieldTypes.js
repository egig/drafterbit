const fieldTypes = [
    {
        id: 1,
        name: 'Short Text',
    },
    {
        id: 2,
        name: 'Long Text',
    },
    {
        id: 3,
        name: 'Rich Text'
    },
    {
        id: 4,
        name: 'Relation to One'
    },
    {
        id: 5,
        name: 'Relation to Many'
    },
    {
        id: 6,
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