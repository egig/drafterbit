import React from 'react';

const Header = function (props) {
	return (
		<header>
			<h2>{props.title}</h2>
			<p style={{color: '#676767'}}>{props.subtitle}</p>
		</header>
	)
};

export default Header;