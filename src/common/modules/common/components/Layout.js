import React from 'react';
import Nav from '../../common/components/Nav';

class Layout extends React.Component {
	render() {
		return (
			<div className="columns">
          <Nav />
					<main className="column">
						{this.props.children}
					</main>
      </div>
		);
	}
}

export default Layout;