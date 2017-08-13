import React from 'react';
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons';
import { Link } from 'react-router-dom';

class ForgetPassword extends React.Component {

	render() {
		return (
			<div style={{
				width: '400px',
				margin: '0 auto',
			}}>
				<div style={{
					textAlign: 'center'
				}}>
					<img src="/img/dinas_pu.png" />
					<h1>e-TGR</h1>
					<h2>Aplikasi Penatausahaan Piutang TGR</h2>
				</div>
				<h2>Masukkan alamat email anda</h2>
				<form>
					<TextField id="singleTitle" placeholder="Email" />
					<Button raised type="submit" primary label="Masuk"/>
					<Button href="/user/login" flat label="Batal"/>
				</form>
			</div>
		);
	}
}

export default ForgetPassword;