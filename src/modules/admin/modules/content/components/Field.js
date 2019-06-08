import React from 'react';
import RichText from './RichText';
import Relation  from './Relation';

class Field extends React.Component {

    render() {
        let field = this.props.field;
        let value = this.props.value;
        let types = {
            '1': () => (
                <input value={value} onChange={this.props.onChange} name={field.name} type="text" className="form-control" />
            ),
            '2': () => (
                <textarea value={value} onChange={this.props.onChange} name={field.name} type="text" className="form-control" />
            ),
            '3': () => (
                <RichText initialValue={value} onChange={this.props.onChange} />
            ),
            '4': () => (
                <Relation relatedContentTypeId={field.related_content_type_id}  onChange={this.props.onChange} value={value} />
            ),
            // TODO fix multiple relation
            '5': () => (
                <Relation multiple={true} relatedContentTypeId={field.related_content_type_id}  onChange={this.props.onChange} value={value ? value : []} />
            ),
            '6': () => (
                <input value={value} onChange={this.props.onChange} name={field.name} type="number" className="form-control" />
            ),
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