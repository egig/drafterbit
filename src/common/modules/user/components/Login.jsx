import React from 'react';
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			error: false,
			errorText: ''
		}
		this.onFormSubmit = this.onFormSubmit.bind(this);
	}

	onFormSubmit(e) {
		e.preventDefault();
		let email = e.target.email.value;
		let password =  e.target.password.value;

		axios.post('/api/user/login', {
			email, password
		}).then(response => {
			if(!response.data.success) {
				this.setState({
					error: true,
					errorText: response.data.message
				})
			} else {
				this.setState({
					error: false,
					errorText: ''
				});

				window.location.replace("/");
			}

		}).catch(e => {
			console.log(e);
		})
	}

	render() {
		return (
			<div style={{
				maxWidth: '360px',
				width: '100%',
				margin: '100px auto 0',
			}}>
				<form onSubmit={this.onFormSubmit} method="POST">
					<TextField name="email" placeholder="Email"  error={this.state.error} />
					<TextField name="password" placeholder="Kata Sandi" type="password" error={this.state.error} errorText={this.state.errorText} />
					<Button type="submit" raised primary label="Masuk" style={{ width: '100%' }}/>
				</form>
				<div style={{
					textAlign: 'center'
				}}>
					<Button flat style={{textAlign: 'center'}} href="/user/forget_password" label="Lupa Password ?" />
				</div>
			</div>
		);
	}
}

export default Login;