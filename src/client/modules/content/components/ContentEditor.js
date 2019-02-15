const React = require('react');
import  { Editor, findNode } from 'slate-react';
import { Value } from 'slate';
import Style from './ContentEditor.style'
import withStyle from '../../../withStyle';
import ProjectLayout from '../../project/components/ProjectLayout';

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

function H1Node(props) {
	return <h1>{props.children}</h1>
}

class ContentEditor extends React.Component {


	componentDidMount() {

	}

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

	onKeyUp = (event, change) => {
		this.getCurrentNode(change);
	}

	renderNode = ({node, ...props}) => {
		switch (node.type) {
			case 'h1': return <H1Node {...props} />
		}
	}


	onEnter = (event, change) => {
		const { value } = change;
		if (value.isExpanded) return;

		event.preventDefault()
		change.splitBlock().setBlock('paragraph')
		return true
	}

	// onFocus = (event, change) => {
	//
	// 	this.getCurrentNode(change);
	// };

	getCurrentNode = (change) => {

		const node = change.value.document.getNode(change.value.focusKey);
		if(node.text === "") {
			const selection = window.getSelection();
			if(selection.rangeCount > 0) {
				const range = selection.getRangeAt(0);
				const rect = range.getBoundingClientRect();
				document.getElementById('inlineTooltip').style.position = "absolute";
				document.getElementById('inlineTooltip').style.top = rect.top+"px";
				document.getElementById('inlineTooltip').style.left = rect.left+"px";
				document.getElementById('inlineTooltip').style.display = "block";
			}
		} else {
			document.getElementById('inlineTooltip').style.display = "none";
		}
	}

	componentDidUpdate() {
		this.getCurrentNode(this.state.value.change());
	}

	render() {

		let { classNames } = this.props;
		return (
			<ProjectLayout>
				<div className={classNames.container}>
					<div className={classNames.editorContainer}>
						<Editor
							value={this.state.value}
							onChange={this.onChange}
							onKeyDown={this.onKeyDown}
							onKeyUp={this.onKeyUp}
							renderNode={this.renderNode}
						  onFocus={this.onFocus}
						/>
					</div>
					<button id="inlineTooltip" className="btn">Add</button>
				</div>
			</ProjectLayout>
		)
	}
}

export default withStyle(Style)(ContentEditor);