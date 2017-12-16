import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../actions';
import { withRouter } from 'react-router-dom'

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
        return (
            <section className="hero is-fullheight">
                <div className="hero-body">
                    <div className="container has-text-centered">
                        <div className="column is-4 is-offset-4">
                            <div className="box">
                                <h3 className="title has-text-grey">Login</h3>
                                <p className="subtitle has-text-grey">Please login to proceed.</p>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    this.doLogin(e);
                                }}>
                                    <div className="field">
                                        <div className="control">
                                            <input className="input is-large" type="email" placeholder="Your Email" autoFocus="" name="email" />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <div className="control">
                                            <input className="input is-large" type="password" placeholder="Your Password" name="password" />
                                        </div>
                                    </div>
                                    <button type="submit" className="button is-block is-info is-large is-fullwidth">Login</button>
                                </form>
                            </div>
                            <p className="has-text-grey">
                                <a href="../">Sign Up</a> &nbsp;·&nbsp;
                                <a href="../">Forgot Password</a> &nbsp;·&nbsp;
                                <a href="../">Need Help?</a>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);