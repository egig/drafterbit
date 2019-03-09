import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

class RichText extends React.Component {

	render() {
		return (
			<Editor
				initialValue={this.props.initialValue}
				init={{
					menubar: false,
          plugins: 'link',
          toolbar: 'bold italic underline | alignleft aligncenter alignright alignjustify'
        }}
				onChange={this.props.onChange}
			/>
		);
	}
}


module.exports = RichText;