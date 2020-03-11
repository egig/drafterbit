import React, { Component } from "react";

import "./Editor.css"

let initialValue = {
    "object": "value",
    "document": {
        "nodes": [
            {
                "object": "block",
                "type": "paragraph",
                "nodes": [
                    {
                        "object": "text"
                    }
                ]
            }
        ]
    }
}

import SlateEditor from '../SlateEditor';
import { Value, KeyUtils } from "slate";
// import Plain from "slate-plain-serializer";

class Editor extends Component {
    constructor(props) {
        super(props);
        KeyUtils.resetGenerator(); // This is for SSR
    }

    render() {

        return (
            <div className="content-editor">
                <SlateEditor
                    onChange={this.props.onChange}
                    value={this.props.value}
                    onFileSelected={() => {}}
                />
            </div>
        );
    }
}

export default Editor;