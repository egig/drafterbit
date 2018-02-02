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
				type: 'h1',
				nodes: [
					{
						kind: 'text',
						leaves: [
							{
								text: 'test h1'
							}
						]
					}
				]
			},
			{
				kind: 'block',
				type: 'paragraph',
				nodes: [
					{
						kind: 'text',
						leaves: [
							{
								text: 'test'
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

function H1Node(props) {
	return <h1>{props.children}</h1>
}

class ContentEditor extends React.Component {

	state = {
		value:initialValue
	}

	onChange = ({ value }) => {
		this.setState({ value })
	}

	onKeyDown = (event, change) => {
		if(event.key === "Enter") {
			this.onEnter(event, change);
		}
	}

	renderNode = ({node, ...props}) => {
		switch (node.type) {
			case 'h1': return <H1Node {...props} />
		}
	}


	onEnter = (event, change) => {
		const { value } = change
		if (value.isExpanded) return

		event.preventDefault()
		change.splitBlock().setBlock('paragraph')
		return true
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
							onKeyDown={this.onKeyDown}
							renderNode={this.renderNode}
						/>
					</div>
					<button className="btn">Add</button>
				</div>
			</Layout>
		)
	}
}

export default injectSheet(styles)(ContentEditor);