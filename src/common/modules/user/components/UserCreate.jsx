import React from 'react';
import Paper from 'react-md/lib/Papers/Paper';
import TextField from 'react-md/lib/TextFields/TextField';
import SelectField from 'react-md/lib/SelectFields/SelectField';
import SnackBar from 'react-md/lib/Snackbars';
import Button from 'react-md/lib/Buttons/Button';
import axios from 'axios';
import Layout from '../../common/components/Layout';
import FormPanel from '../../common/components/FormPanel';
import FormFooter from '../../common/components/FormFooter';
import validate from 'validate.js';

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

class UserCreate extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			tipeUser: '',
			daftarEselon: [],
			namaError: false,
			namaErrorText: '',
			emailError: false,
			emailErrorText: '',
			passwordError: false,
			passwordErrorText: '',
			phoneError: false,
			phoneErrorText: '',
			namaAtasanError: false,
			namaAtasanErrorText: '',
			handPhoneAtasanError: false,
			handPhoneAtasanErrorText: '',
			jenisPenggunaError: false,
			jenisPenggunaErrorText: '',
			namaEselonError: false,
			namaEselonErrorText: '',
			namaSatkerError: false,
			namaSatkerErrorText: '',
			kodeError: false,
			kodeErrorText: '',
			toasts: [],
			autohide: true,
		};

		validate.validators.presence.message = "tidak boleh kosong";
		this.constraints = {
			nama: { presence: true },
			phone: { presence: true },
			email: { presence: true },
			password: { presence: true },
			namaAtasan: { presence: true },
			handPhoneAtasan: { presence: true },
			jenisPengguna: { presence: true },
		};

		this.onFormSubmit = this.onFormSubmit.bind(this);
		this.onJenisPenggunaChange = this.onJenisPenggunaChange.bind(this);
	}

	componentDidMount() {
		axios.get('/api/user/eselon')
			.then(response => {
				this.setState({
					daftarEselon: response.data
				})
			})
	}
	
	onJenisPenggunaChange(v) {
		console.log(v);
		this.setState({
			tipeUser: v
		});
	};

	onFormSubmit(e) {
		e.preventDefault();

		let form = e.target;

		let data = {
			email: form.email.value,
			password: form.password.value,
			nama: form.nama_pengguna.value,
			tipeUser: parseInt(form.jenis_pengguna.value),
			phone: form.hp.value,
			namaAtasan: form.nama_atasan.value,
			handPhoneAtasan: form.hp_atasan.value,
			jenisPengguna: this.state.tipeUser,
			status: 1,
		};

		let constraints = this.constraints;

		if(parseInt(this.state.tipeUser) === 2) {
			data.namaEselon = form.nama_eselon.value;
			data.namaTipeUser = data.namaEselon;
			data.kode = form.kode_eselon.value;
			constraints['namaEselon'] = { presence: true };
		}

		if(parseInt(this.state.tipeUser) === 3) {
			data.namaSatker = form.satuan_kerja.value;
			data.namaTipeUser = data.namaSatker;
			data.kode = form.kode_satuan_kerja.value;

			data.parent = {
				userId: form.eselon.value
			};

			constraints['namaSatker'] = { presence: true };
		}

		let errors = validate(data, constraints);
		console.log(errors);

		if(errors) {
			// Notification
			const toasts = this.state.toasts.slice();
			toasts.push({ text: "ERROR: Silahkan cek kembali isian Form." });
			this.setState({ toasts });

			let errorState = {};
			for(let k in  this.constraints) {
				if(k in errors) {
					errorState[k+'Error'] = true;
					errorState[k+'ErrorText'] = errors[k].join("<br/>");
				} else {
					errorState[k+'Error'] = false;
					errorState[k+'ErrorText'] = "";
				}
			}

			this.setState(errorState);
			return false;
		} else {
			console.log(data);
			axios.post('/api/user/create', data)
				.then(response => {
					if(response.data[0].user) {

						// Notification
						const toasts = this.state.toasts.slice();
						toasts.push({ text: "SUCCESS: Data berhasil disimpan." });
						this.setState({ toasts });

						setTimeout(function () {
							window.location.replace('/secure/users')
						}, 2000);
					}
				})
				.catch(e => {
					console.error(e);
					const toasts = this.state.toasts.slice();
					toasts.push({ text: `ERROR: ${e.response.data.error.message}.` });
					this.setState({ toasts, isLoading: false  });
				})
		}
	}

	render() {

		const jenisPengguna = [{
			id: 2,
			name: "Eselon",
		}, {
			id: 3,
			name: "Satuan Kerja"
		}];

		let eselonDisplay = 'none';
		let satkerDisplay = 'none';

		if(parseInt(this.state.tipeUser) === 2) {
			eselonDisplay = 'flex';
		}

		if(parseInt(this.state.tipeUser) === 3) {
			satkerDisplay = 'flex';
		}

		return (
			<Layout title="Buat Profil Pengguna Baru" subtitle="Form pendaftaran pengguna baru">
				<form onSubmit={this.onFormSubmit}>
				<FormPanel>
						<header>
							<h4>Data Profil Pengguna</h4>
						</header>
						<FieldRow
							label="Nama Pengguna"
						  input={<TextField
							  error={this.state.namaError}
							  errorText={this.state.namaErrorText}
							  name="nama_pengguna"
							  required
							  placeholder="Nama Pengguna"/>}
						/>
						<FieldRow
							label="Handphone"
							input={<TextField
								error={this.state.phoneError}
								errorText={this.state.phoneErrorText}
								name="hp" required placeholder="08xxxxxxxxx"/>}
						/>
						<FieldRow
							label="Email"
							input={<TextField
								error={this.state.emailError}
								errorText={this.state.emailErrorText}
								name="email" required placeholder="pengguna@email.com"/>}
						/>
						<FieldRow
							label="Password"
							input={<TextField
								error={this.state.passwordError}
								errorText={this.state.passwordErrorText}
								name="password" required type="password"/>}
						/>
						<FieldRow
							label="Konfirmasi Password"
							input={<TextField name="konfirmasi_password" required type="password"/>}
						/>
						<FieldRow
							label="Nama Atasan"
							input={<TextField
								error={this.state.namaAtasanError}
								errorText={this.state.namaAtasanErrorText}
								name="nama_atasan" required placeholder="Nama Atasan"/>}
						/>
						<FieldRow
							label="Handphone Atasan"
							input={<TextField
								error={this.state.handPhoneAtasanError}
								errorText={this.state.handPhoneAtasanErrorText}
								name="hp_atasan" required placeholder="08xxxxxxxxx"/>}
						/>
						<div className="md-grid">
							<div className="md-cell md-cell--2" style={{marginTop: '18px'}}>
								<label>Jenis Pengguna</label>
							</div>
							<SelectField
								name="jenis_pengguna"
								id="jenis_pengguna"
								label={false}
								required
								placeholder="Pilih jenis Pengguna"
								menuItems={jenisPengguna}
								itemLabel="name"
								itemValue="id" className="md-cell md-cell--5"
								onChange={this.onJenisPenggunaChange}
								error={this.state.jenisPenggunaError}
								errorText={this.state.jenisPenggunaErrorText}
							/>
						</div>
						<FieldRow
							style={{display: eselonDisplay}}
							label="Eselon"
							input={<TextField
								error={this.state.namaEselonError}
								errorText={this.state.namaEselonErrorText}
								name="nama_eselon" required placeholder="Eselon"/>}
						/>
						<FieldRow
							style={{display: eselonDisplay}}
							label="Kode Eselon"
							input={<TextField
								error={this.state.kodeError}
								errorText={this.state.kodeErrorText}
								name="kode_eselon" placeholder="Kode Eselon"/>}
						/>
						<div className="md-grid"
						     style={{display: satkerDisplay}}
						>
							<div className="md-cell md-cell--2" style={{marginTop: '18px'}}>
								<label>Eselon</label>
							</div>
							<SelectField
								name="eselon"
								id="eselon"
								label={false}
								required
								placeholder="Pilih Eselon"
								menuItems={this.state.daftarEselon}
								itemLabel="kodeNnama"
								itemValue="id"
								className="md-cell md-cell--5" />
						</div>
						<FieldRow
							style={{display: satkerDisplay}}
							label="Satuan Kerja"
							input={<TextField
								error={this.state.namaSatkerError}
								errorText={this.state.namaSatkerErrorText}
								name="satuan_kerja" required placeholder="Satuan Kerja"/>}
						/>
						<FieldRow
							style={{display: satkerDisplay}}
							label="Kode Satuan Kerja"
							input={<TextField
								error={this.state.kodeError}
								errorText={this.state.kodeErrorText}
								name="kode_satuan_kerja" required placeholder="Kode Satuan Kerja"/>}
						/>
				</FormPanel>
				<FormFooter>
					<Button href="/secure/users" flat label="Batal"/>
					<Button type="submit" raised primary label="Simpan"/>
				</FormFooter>
				</form>
				<SnackBar toasts={this.state.toasts} autohide={true}  onDismiss={() => {
					const [, ...toasts] = this.state.toasts;
					this.setState({ toasts });
				}}/>
		</Layout>
		);
	}
}

const FieldRow  = function (props) {
	return(
		<div className="md-grid" style={props.style}>
			<div className="md-cell md-cell--2" style={{marginTop: '18px'}}>
				<label>{props.label}</label>
			</div>
			<div className="md-cell md-cell--5">
				{props.input}
			</div>
		</div>
	);
};

export default UserCreate;