import React from 'react';
import withStyle from '../withStyle';
import Style from './Modal.style'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Modal extends React.Component {
	render() {
		let { classNames } = this.props;
		return (
		<ReactCSSTransitionGroup
			transitionName={{
		    enter: classNames.modalEnter,
		    enterActive: classNames.modalEnterActive,
		    leave: classNames.modalLeave,
		    leaveActive: classNames.modalLeaveActive,
		    appear: classNames.modalAppear,
		    appearActive: classNames.modalAppearActive
		  }}
			transitionAppear={true}
			transitionAppearTimeout={200}
			transitionEnter={false}
			transitionLeaveTimeout={200}>
			<div className={classNames.modalTrap}>
				<div className={classNames.dialogContainer}>
					{this.props.children}
				</div>
			</div>
		</ReactCSSTransitionGroup>
		)
	}
}

Modal.defaultProps = {
	isActive: false
}

export default withStyle(Style)(Modal);