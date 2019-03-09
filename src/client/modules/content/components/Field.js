const React = require('react');
const RichText = require('./RichText');
const Relation = require('./Relation');

class Field extends React.Component {

    render() {
        let field = this.props.field;
        let value = this.props.value;
        let types = {
            '1': () => (
                <div className="form-group">
                    <label htmlFor={field.name}>{field.label}</label>
                    <input value={value} onChange={this.props.onChange} name={field.name} type="text" className="form-control" />
                </div>
            ),

            '2': () => (
                <div className="form-group">
                    <label htmlFor={field.name}>{field.label}</label>
                    <textarea value={value} onChange={this.props.onChange} name={field.name} type="text" className="form-control" />
                </div>
            ),
            '3': () => (
                <div className="form-group">
                    <label htmlFor={field.name}>{field.label}</label>
	                <RichText initialValue={value} onChange={this.props.onChange} />
                </div>
            ),
		        '4': () => (
			        <div className="form-group">
				        <label htmlFor={field.name}>{field.label}</label>
				        <Relation relatedContentTypeId={field.related_content_type_id}  onChange={this.props.onChange} value={value} />
			        </div>
		        ),
        };

        return types[field.type_id]();
    }
}

module.exports = Field;