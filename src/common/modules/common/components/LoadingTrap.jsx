import React from 'react';

const LoadingTrap = function (props) {

	let display = props.active ? 'block' : 'none';

	return(
		<div style={{
			display: display,
			position: 'fixed',
			top: '0',
			right: '0',
			left: '0',
			bottom: '0',
			zIndex: '100',
			backgroundColor: 'rgba(255,255,255, 0.8)'
		}}>
			<img style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)'
			}
			} src="/img/loading.svg" />
		</div>)
}

export default LoadingTrap;