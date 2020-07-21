import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

// Import TinyMCE
// @ts-ignore
import tinymce from 'tinymce/tinymce';

// Default icons are required for TinyMCE 5.3 or above
import 'tinymce/icons/default';

// A theme is also required
import 'tinymce/themes/silver';

// Any plugins you want to use has to be imported
// import 'tinymce/plugins/paste';
// import 'tinymce/plugins/link';

// Initialize the app
tinymce.init({
    selector: '#tiny',
    plugins: [],
    skin_url: '/skins'
});

type Props = {
    onChange: any,
    initialValue: any
}

class RichText extends React.Component<Props, {}> {
    handleEditorChange = (content: any, editor: any) => {
        this.props.onChange(content);
    };

    render() {

        return (
            <Editor
                initialValue={this.props.initialValue}
                init={{
                    height: 400,
                    menubar: false,
                    statusbar: false,
                    plugins: [],
                    skin: 'oxide',
                    skin_url: '/skins/ui/oxide',
                    content_css: '/skins/content/default/content.min.css',
                    toolbar:
                        'undo redo | formatselect | bold italic underline backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat'
                }}
                onEditorChange={this.handleEditorChange}
            />
        );
    }
}

export default RichText;
