import React from 'react';
import Nav from '../../common/components/Nav';

class Layout extends React.Component {
	render() {
		return (
			<span>
				<Nav/>
				<div className="container">
							{this.props.children}
	      </div>
			</span>
		);
	}
}

export default Layout;