const React = require('react');
const RichText = require('./RichText');

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
            )
        };

        return types[field.type_id]();
    }
}

module.exports = Field;