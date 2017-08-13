import React from 'react';
import Paper from 'react-md/lib/Papers/Paper';

const FormPanel = function (props) {

	return (
		<Paper style={{
			backgroundColor: 'white',
			padding: '10px',
			marginBottom: '20px'
		}}>
			{props.children}
		</Paper>)
};

export default FormPanel;