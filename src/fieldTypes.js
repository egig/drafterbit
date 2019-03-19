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
			name: "Rich Text"
		},
		{
			id: 4,
			name: "Relation to One"
		},
		{
			id: 5,
			name: "Relation to Many"
		},
		{
			id: 6,
			name: "Number"
		}
];

const getFieldTypesObject = function getFieldTypesObject() {
	let fieldTypeObject = {};
	fieldTypes.map(f => {
		fieldTypeObject[f.id] = f.name
	});
	return fieldTypeObject;
};

const getFieldTypeName = function getFieldName(id) {
	return getFieldTypesObject()[id];
};

const getFieldTypes = function getFields() {
    return fieldTypes;
};


module.exports = {
	getFieldTypes,
	getFieldTypeName
};