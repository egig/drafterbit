import React from 'react';

class Field extends React.Component {

    render() {
        let field = this.props.field;
        let types = {
            '1': () => (
                <div className="form-group">
                    <label htmlFor={field.name}>{field.label}</label>
                    <input onChange={this.props.onChange} name={field.name} type="text" className="form-control" />
                </div>
            ),

            '2': () => (
                <div className="form-group">
                    <label htmlFor={field.name}>{field.label}</label>
                    <textarea onChange={this.props.onChange} name={field.name} type="text" className="form-control" />
                </div>
            )
        };

        return types[field.type_id]();
    }
}

export default Field;