class FieldType {
    static SHORT_TEXT = "ShortText";
    static LONG_TEXT = "LongText";
    static RICH_TEXT = "RichText";
    static NUMBER = "Number";

    static fieldTypes = [
        {
            id: FieldType.SHORT_TEXT,
            name: 'Short Text',
            validationOptions: [
                'is_required',
                'unique',
                'min_length',
                'max_length',
            ],
            op: [
                {sym:"="},
                {sym:"=~"},
            ]
        },
        {
            id: FieldType.LONG_TEXT,
            name: 'Long Text',
            validationOptions: [
                'is_required',
                'unique',
                'min_length',
                'max_length',
            ],
            op: [
                {sym:"="},
                {sym:"=~"},
            ]
        },
        {
            id: FieldType.RICH_TEXT,
            name: 'Rich Text',
            validationOptions: [
                'is_required',
                'min_length',
                'max_length',
            ],
            op: [
                {sym:"="},
                {sym:"=~"},
            ]
        },
        {
            id: FieldType.NUMBER,
            name: 'Number',
            validationOptions: [
                'is_required',
                'unique',
                'min',
                'max',
            ],
            op: [
                {sym:"="},
                {sym:"=>"},
                {sym:"=<"}
            ]
        }
    ];

    static asMap() {
        return FieldType.fieldTypes.reduce((o: any, f: any) => {
            o[f.id] = f.name;
            return o
        }, {});
    }

    static asObject() {
        return FieldType.fieldTypes.reduce((o: any, f: any) => {
            o[f.id] = f;
            return o
        }, {});
    }

    static getTypeName(id: string) {
        return FieldType.asMap()[id];
    }

    static get(id: string) {
        return FieldType.asObject()[id];
    }

    static primitives() {
        return FieldType.fieldTypes.map(t => {
            return t.id
        });
    }
}

export default FieldType;