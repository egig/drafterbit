/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom'
import actions from '../actions';
import Style from './Login.style';
import AuthCard from './AuthCard';
import withStyle from '../../../withStyle';
import { Helmet } from 'react-helmet';
import translate from '../../../translate';
import Notify from '../../../components/Notify';

class Login extends React.Component<{
    doLogin: Function,
    t: Function,
    classNames: Object,
    history: Object}, {errorText: string}> {

    constructor(props) {
        super(props);

        this.state = {
            errorText: ''
        }
    }

    doLogin = (e) => {
        let form = e.target;
        let email = form.email.value;
        let password = form.password.value;

        this.props.doLogin(email, password)
            .then((r)=> {
              // TODO get referer
                this.props.history.push('/');
            }).catch(error => {

            let message;

            if (error.response) {
                message = error.response.data.message;
            } else if (error.request) {
                message = "ERROR unknown";
            } else {
                message = error.message;
            }

            this.setState({
                errorText: message
            })
        });
    }

    render() {

        let classes = this.props.classNames;
        let t = this.props.t;

        return (
            <AuthCard title={t('login:title')}>
                <Helmet>
                    <title>Login - Drafterbit</title>
                </Helmet>

                {this.state.errorText &&
                    <div className="alert alert-warning">
                        {this.state.errorText}
                    </div>
                }
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
                        <button type="submit" className={`btn btn-success btn-block ${classes.btnPadding}`}>
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
        currentUser: state.USER.currentUser
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};

export default translate(['login'])(withStyle(Style)(
        connect(mapStateToProps, mapDispatchToProps)(Login)
));