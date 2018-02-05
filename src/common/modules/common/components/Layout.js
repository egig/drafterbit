import React from 'react';
import Nav from '../../common/components/Nav';
import withStyle from '../../../withStyle';
import Style from './Layout.style';

class Layout extends React.Component {
	render() {

		let { classNames } = this.props;

		return (
			<span>
				<Nav/>
				<div className={`container ${classNames.layoutContainer}`}>
					{this.props.children}
	      </div>
			</span>
		);
	}
}

export default withStyle(Style)(Layout);