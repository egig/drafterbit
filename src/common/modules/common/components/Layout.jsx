import React from 'react';
import Header from './Header';
import Content from './Content';

const Layout = function (props) {

	return (
		<Content>
			<Header title={props.title} subtitle={props.subtitle} />
			{props.children}
		</Content>
	)
};

export default Layout;