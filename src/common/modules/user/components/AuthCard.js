import React from 'react';
import Style from './AuthCard.style';
import withStyle from '../../../withStyle';
import translate from '../../../../translate';

class AuthCard extends React.Component {

	render() {

		let classes = this.props.classNames;

		return (
			<div className="h-100 my-login-page">
				<div className="container h-100">
					<div className="row justify-content-md-center h-100">
						<div className={classes.cardWrapper}>
							<div className={`brand ${classes.brandContainer}`}>
								<img className={classes.brandImg} src="/img/drafterbit-logo.png" />
							</div>
							<div className={`card fat ${classes.cardFatPadding}`}>
								<div className="card-body">
									<h4 className={`card-title ${classes.cardTitleMargin}`}>{this.props.title}</h4>
									{this.props.children}
								</div>
							</div>
							<div className={classes.loginFooter}>
								Copyright &copy; 2017 &mdash; drafterbit
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withStyle(Style)(AuthCard);