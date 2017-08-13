import React from 'react';
import Paper from 'react-md/lib/Papers/Paper';

const Panel = function (props) {

	return (
		<Paper style={{
			backgroundColor: 'white',
			padding: '10px'
		}}>
			{props.children}
	</Paper>)
};

export default Panel;