import React from 'react';
import withStyle from '../withStyle';
import Style from './LoaderTrap.style'

class LoaderTrap extends React.Component {
	render() {
		let { classNames } = this.props;
		return (
			<div className={classNames.loaderTrap+(this.props.isActive ? " "+classNames.loaderActive : '')}>
				<div className={classNames.loaderImgContainer}>
					<img src="/img/ajax-loader.svg" />
				</div>
			</div>
		)
	}
}

LoaderTrap.defaultProps = {
	isActive: false
}

export default withStyle(Style)(LoaderTrap);