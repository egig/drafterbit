import React from 'react';


class Content extends React.Component {

	render() {
		return (
			<div style={{padding: '20px' }}>
				{this.props.children}
			</div>
		)
	}
}

export  default Content;