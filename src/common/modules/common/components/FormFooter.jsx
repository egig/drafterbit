import React from 'react';


const FormFooter = function (props) {

	return(
		<div style={{
			position: 'relative',
			textAlign: 'right',
			backgroundColor: 'white',
			marginLeft: '-26px',
			marginRight: '-26px',
			padding: '26px'
		}}>
			{props.children}
		</div>
	);
}

export default FormFooter;