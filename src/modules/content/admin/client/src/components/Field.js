import React from 'react';
import RichText from './RichText';
import Relation  from './Relation';

const {
    FIELD_SHORT_TEXT,
    FIELD_LONG_TEXT,
    FIELD_RICH_TEXT,
    FIELD_RELATION_TO_ONE,
    FIELD_RELATION_TO_MANY,
    FIELD_NUMBER,
    FIELD_UNSTRUCTURED
} = window.__DT_CONST;

class Field extends React.Component {

    render() {
        let field = this.props.field;
        let value = this.props.value;
        let types = {
            [FIELD_SHORT_TEXT]: () => (
                <input value={value} onChange={this.props.onChange} name={field.name} type="text"
                       className="form-control"/>
            ),
            [FIELD_LONG_TEXT]: () => (
                <textarea value={value} onChange={this.props.onChange} name={field.name} type="text"
                          className="form-control"/>
            ),
            [FIELD_RICH_TEXT]: () => (
                <RichText initialValue={value} value={value}  onChange={this.props.onChange}/>
            ),
            [FIELD_RELATION_TO_ONE]: () => (
                <Relation relatedContentTypeSlug={field.related_content_type_slug} onChange={this.props.onChange}
                          value={value}/>
            ),
            [FIELD_RELATION_TO_MANY]: () => (
                <Relation multiple={true} relatedContentTypeSlug={field.related_content_type_slug}
                          onChange={this.props.onChange} value={value ? value : []}/>
            ),
            [FIELD_NUMBER]: () => (
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