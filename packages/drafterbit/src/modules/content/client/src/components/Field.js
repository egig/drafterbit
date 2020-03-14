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
            [FieldType.RELATION_TO_ONE]: () => (
                <Relation relatedContentTypeSlug={field.related_content_type_slug} onChange={this.props.onChange}
                          value={value}/>
            ),
            [FieldType.RELATION_TO_MANY]: () => (
                <Relation multiple={true} relatedContentTypeSlug={field.related_content_type_slug}
                          onChange={this.props.onChange} value={value ? value : []}/>
            ),
            [FieldType.NUMBER]: () => (
                <input value={value} onChange={this.props.onChange} name={field.name} type="number"
                       className="form-control"/>
            )
        };

        return (
	        <div className="form-group">
		        <label htmlFor={field.name}>{field.label}</label>
		        {types[field.type_id]()}
	        </div>
        );
    }
}

export default Field;