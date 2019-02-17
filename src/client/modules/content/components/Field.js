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
                    <input onChange={this.props.onChange} name={field.name} type="text" className="form-control" />
                </div>
            ),

            '2': () => (
                <div className="form-group">
                    <label htmlFor={field.name}>{field.label}</label>
                    <textarea onChange={this.props.onChange} name={field.name} type="text" className="form-control" />
                </div>
            ),
		        '3': () => (
		          <div className="form-group">
				        <CKEditor
					        editor={ ClassicEditor }
					        data="<p>Hello from CKEditor 5!</p>"
					        onInit={ editor => {
					                        // You can store the "editor" and use when it is needed.
					                        console.log( 'Editor is ready to use!', editor );
					                    } }
					        onChange={ ( event, editor ) => {
					                        const data = editor.getData();
					                        console.log( { event, editor, data } );
					                    } }
					        onBlur={ editor => {
					                        console.log( 'Blur.', editor );
					                    } }
					        onFocus={ editor => {
					                        console.log( 'Focus.', editor );
					                    } }
				        />
			        </div>
		        )
        };

        return types[field.type_id]();
    }
}

export default Field;