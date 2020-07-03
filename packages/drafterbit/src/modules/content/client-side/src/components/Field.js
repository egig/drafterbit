import React from 'react';
import RichText from './RichText';
import Relation  from './Relation';

const FieldType = require('@drafterbit/common/FieldType');

class Field extends React.Component {

    render() {
        let field = this.props.field;
        let value = this.props.value;
        let types = {
            [FieldType.SHORT_TEXT]: () => (
                <input value={value} onChange={this.props.onChange} name={field.name} type="text"
                       className="form-control"/>
            ),
            [FieldType.LONG_TEXT]: () => (
                <textarea value={value} onChange={this.props.onChange} name={field.name}
                          className="form-control"/>
            ),
            [FieldType.RICH_TEXT]: () => (
                <RichText initialValue={value} value={value}  onChange={this.props.onChange}/>
            ),
            [FieldType.NUMBER]: () => (
                <input value={value} onChange={this.props.onChange} name={field.name} type="number"
                       className="form-control"/>
            )
        };

        if (FieldType.primitives().indexOf(field.type_name) !== -1) {
            return (
                <div className="form-group">
                    <label htmlFor={field.name}>{field.display_text}</label>
                    {types[field.type_name]()}
                </div>
            );
        } else {
            return (
                <div className="form-group">
                    <label htmlFor={field.name}>{field.display_text}</label>
                    <Relation multiple={field.multiple}
                              typeName={field.type_name}
                              onChange={this.props.onChange}
                              value={value ? value : []}/>
                </div>
            )
        }
    }
}

export default Field;