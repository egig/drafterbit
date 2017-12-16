import React from 'react';
import  { Editor } from 'slate-react';
import { Value } from 'slate';
import injectSheet from 'react-jss'
import Layout from '../../common/components/Layout';

const initialValue = Value.fromJSON({
	document: {
		nodes: [
			{
				kind: 'block',
				type: 'paragraph',
				nodes: [
					{
						kind: 'text',
						leaves: [
							{
								text: ''
							}
						]
					}
				]
			}
		]
	}
});

const styles = {
	container: {
		background: "#e1e1e1",
		minHeight: '600px'
	},
	editorContainer: {
		background: "#FFFFFF",
		width: "600px",
		margin: "auto",
		padding: '10px'
	}
};

class ContentEditor extends React.Component {

	state = {
		value:initialValue
	}

	onChange = ({ value }) => {
		this.setState({ value })
	}

	render() {

		let { classes } = this.props;
		return (
			<Layout>
				<div className={classes.container}>
					<div className={classes.editorContainer}>
						<Editor
							value={this.state.value}
							onChange={this.onChange}
						/>
					</div>
				</div>
			</Layout>
		)
	}
}

export default injectSheet(styles, {inject: false})(ContentEditor);