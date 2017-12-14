import React from 'react';
import  { Editor } from 'slate-react';
import { Value } from 'slate';
import injectSheet from 'react-jss'

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

class Home extends React.Component {

	state = {
		value:initialValue
	}

	onChange = ({ value }) => {
		this.setState({ value })
	}

	render() {

		let { classes } = this.props;
		return (
			<div className={classes.container}>
				<div className={classes.editorContainer}>
					<Editor
						value={this.state.value}
						onChange={this.onChange}
					/>
				</div>
			</div>
		)
	}
}

export default injectSheet(styles, {inject: false})(Home);