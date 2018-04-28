import React from 'react';

class Column extends React.Component {

	render() {
		return (
			<td>
				{this.props.children}
			</td>
		)
	}
}

export default Column;