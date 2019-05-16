import React from 'react';
import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default class DataTable extends React.Component {

	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			isOpen: false
		};
	}

	toggle() {
		this.setState({
			isOpen: !this.state.isOpen
		});
	}

	render() {
		return (
			<ButtonDropdown isOpen={this.state.isOpen} toggle={this.toggle} size="sm" >
				<Button onClick={this.props.onEdit}>Edit</Button>
				<DropdownToggle caret  />
				<DropdownMenu>
					<DropdownItem>Hapus</DropdownItem>
				</DropdownMenu>
			</ButtonDropdown>
		)
	}
}