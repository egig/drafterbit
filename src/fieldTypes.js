const FIELD_SHORT_TEXT = 1;
const FIELD_LONG_TEXT = 2;
const FIELD_RICH_TEXT = 3;
const FIELD_RELATION_TO_ONE = 4;
const FIELD_RELATION_TO_MANY = 5;
const FIELD_NUMBER = 6;

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

function getFieldTypeName(id) {
    return getFieldTypesObject()[id];
}

function getFieldTypes() {
    return fieldTypes;
}

module.exports = {
	FIELD_NUMBER,
	FIELD_RELATION_TO_ONE,
	FIELD_RELATION_TO_MANY,
	FIELD_RICH_TEXT,
	FIELD_LONG_TEXT,
	FIELD_SHORT_TEXT,
	getFieldTypeName,
	getFieldTypes
}