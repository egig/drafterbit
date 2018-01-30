import React from 'react';
import Nav from '../../common/components/Nav';

class Layout extends React.Component {
	render() {
		return (
			<div className="container">
						{this.props.children}
      </div>
		);
	}
}

export default Layout;