import React from 'react';
import withStyle from '../withStyle';
import Style from './Modal.style'

class Modal extends React.Component {
	render() {
		let { classNames } = this.props;
		return (
			<div className={classNames.modalTrap+(this.props.isActive ? " "+classNames.modalActive : '')}>
				<div className={classNames.dialogContainer}>
				{this.props.children}
				</div>
			</div>
		)
	}
}

Modal.defaultProps = {
	isActive: false
}

export default withStyle(Style)(Modal);