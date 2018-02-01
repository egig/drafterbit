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
	        <div className="row justify-content-md-center">
		        <div className="col col-md-4">
			        <form onSubmit={(e) => {
					        e.preventDefault();
					        this.doLogin(e);
				        }}>
				        <div className="form-group">
					        <label htmlFor="exampleInputEmail1">Email</label>
					        <input type="email" name="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
				        </div>
				        <div className="form-group">
					        <label htmlFor="exampleInputPassword1">Password</label>
					        <input type="password" name="password" className="form-control" id="exampleInputPassword1"/>
				        </div>
				        <button type="submit" className="btn btn-primary">Login</button>
			        </form>
		        </div>
	        </div>
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