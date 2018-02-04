import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom'
import actions from '../actions';
import Style from './Login.style';
import AuthCard from './AuthCard';
import withStyle from '../../../withStyle';
import { translate } from 'react-i18next';

class Login extends React.Component {

    constructor(props) {
        super(props);

        this.doLogin = this.doLogin.bind(this);
    }

    doLogin(e) {
        let form = e.target;
        let email = form.email.value;
        let password = form.password.value;

        this.props.doLogin(email, password)
	        .then((r)=> {
        	  console.log(this.props.currentUser);
	        	this.props.history.push('/');
	        });
    }

    render() {

	    let classes = this.props.classNames;
	    const { t } = this.props;

        return (
	        <AuthCard title={t('login:title')}>
		        <form onSubmit={(e) => {
			        e.preventDefault();
			        this.doLogin(e);
		        }}>
			        <div className="form-group">
				        <label htmlFor="email">E-Mail Address</label>
				        <input type="email" name="email" className={`form-control ${classes.formControlBorder}`} id="email" aria-describedby="emailHelp"/>
			        </div>

			        <div className="form-group">
				        <label htmlFor="password" className={classes.labelWidth}>Password
					        <Link to="/forgot-password" className="float-right">
						        Forgot Password?
					        </Link>
				        </label>
				        <input id="password" type="password" className={`form-control ${classes.formControlBorder}`} name="password" required data-eye />
			        </div>

			        <div className="form-group">
				        <label>
					        <input type="checkbox" name="remember" /> Remember Me
				        </label>
			        </div>

			        <div className={`form-group no-margin ${classes.noMargin}`}>
				        <button type="submit" className={`btn btn-primary btn-block ${classes.btnPadding}`}>
					        Login
				        </button>
			        </div>
			        <div className={`${classes.marginTop20} text-center`}>
				        Don't have an account? <Link to="/register">Create account</Link>
			        </div>
		        </form>
	        </AuthCard>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.user.currentUser
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};

export default withStyle(Style)(
	translate('login')(
		connect(mapStateToProps, mapDispatchToProps)(Login)
	)
);