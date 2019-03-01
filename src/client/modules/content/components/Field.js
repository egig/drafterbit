const React = require('react');
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

class Field extends React.Component {

    render() {
        let field = this.props.field;
        let types = {
            '1': () => (
                <div className="form-group">
                    <label htmlFor={field.name}>{field.label}</label>
                    <input value={field.value} onChange={this.props.onChange} name={field.name} type="text" className="form-control" />
                </div>
            ),

            '2': () => (
                <div className="form-group">
                    <label htmlFor={field.name}>{field.label}</label>
                    <textarea value={field.value} onChange={this.props.onChange} name={field.name} type="text" className="form-control" />
                </div>
            ),
		        '3': () => (
		          <div className="form-group">
			          <label htmlFor={field.name}>{field.label}</label>
				        <CKEditor
					        editor={ ClassicEditor }
					        onChange={this.props.onChange}
				          data={field.value}
				        />
			        </div>
		        )
        };

        return types[field.type_id]();
    }
}

export default Field;