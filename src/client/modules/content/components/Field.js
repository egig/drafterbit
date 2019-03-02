const React = require('react');
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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
                    <CKEditor
                        editor={ ClassicEditor }
                        onChange={this.props.onChange}
                        data={value ? value : '' }
                    />
                </div>
            )
        };

        return types[field.type_id]();
    }
}

export default Field;