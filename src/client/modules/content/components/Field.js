const React = require('react');
const RichText = require('./RichText');
const Relation = require('./Relation');

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
		        '5': () => (
			        <Relation multiple={true} relatedContentTypeId={field.related_content_type_id}  onChange={this.props.onChange} value={value ? value : []} />
		        ),
        };

        return (
	        <div className="form-group">
		        <label htmlFor={field.name}>{field.label}</label>
		        {types[field.type_id]()}
	        </div>
        )
    }
}

module.exports = Field;