import React from 'react';
import Paper from 'react-md/lib/Papers/Paper';
import TextField from 'react-md/lib/TextFields/TextField';
import SelectField from 'react-md/lib/SelectFields/SelectField';
import Button from 'react-md/lib/Buttons/Button';
import axios from 'axios';
import Layout from '../../common/components/Layout';
import FormPanel from '../../common/components/FormPanel';
import FormFooter from '../../common/components/FormFooter';
import SnackBar from 'react-md/lib/Snackbars';
import validate from 'validate.js';

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

class UserEdit extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			id: '',
			daftarEselon: [],
			nama: '',
			namaError: false,
			namaErrorText: '',
			email: '',
			emailError: false,
			emailErrorText: '',
			password: '',
			passwordError: false,
			passwordErrorText: '',
			phone: '',
			phoneError: false,
			phoneErrorText: '',
			namaAtasan: '',
			namaAtasanError: false,
			namaAtasanErrorText: '',
			handPhoneAtasan: '',
			handPhoneAtasanError: false,
			handPhoneAtasanErrorText: '',
			jenisPengguna: '',
			jenisPenggunaError: false,
			jenisPenggunaErrorText: '',
			namaEselon: '',
			namaEselonError: false,
			namaEselonErrorText: '',
			eselon: '',
			eselonError: false,
			eselonErrorText: '',
			namaSatker: '',
			namaSatkerError: false,
			namaSatkerErrorText: '',
			kode: '',
			kodeError: false,
			kodeErrorText: '',
			toasts: [],
			autohide: true,
		};

		this.constraints = {
			nama: { presence: true },
			phone: { presence: true },
			email: { presence: true },
			namaAtasan: { presence: true },
			handPhoneAtasan: { presence: true },
			jenisPengguna: { presence: true },
			kode: { presence: true }
		};

		this.onFormSubmit = this.onFormSubmit.bind(this);
		this.onInputChange = this.onInputChange.bind(this);
	}

	componentDidMount() {
		axios.get('/api/user/detail', {
			params: {
				userId: this.props.match.params.userId
			}
		})
			.then(response => {
				let user = response.data;
				this.setState(function (prevState) {

					let newState = {
						id: user.id,
						nama: user.nama,
						email: user.email,
						password: user.password,
						phone: user.phone,
						namaAtasan: user.namaAtasan,
						handPhoneAtasan: user.noTelpAtasan,
						jenisPengguna: user.tipeUser.id,
						kode: user.kode,
					};

					if(parseInt(user.tipeUser.id) === 2) {
						newState.namaEselon = user.userEselon.nama
					}

					if(parseInt(user.tipeUser.id) === 3) {
						newState.namaSatker = user.userSatker.nama
					}

					return newState;
				})
			})
			.catch(e => {
				console.log(e);
			})

		axios.get('/api/user/eselon')
			.then(response => {
				this.setState({
					daftarEselon: response.data
				})
			})
	}

	onFormSubmit(e) {
		e.preventDefault();

		let form = e.target;
		let data = {
			email: form.email.value,
			nama: form.nama_pengguna.value,
			jenisPengguna: form.jenis_pengguna.value,
			tipeUser: parseInt(form.jenis_pengguna.value),
			phone: form.hp.value,
			namaAtasan: form.nama_atasan.value,
			handPhoneAtasan: form.hp_atasan.value,
			status: 1,
		};

		if(!!form.password.value) {
			data.password =  form.password.value
		}

		data.id = this.props.match.params.userId;

		let constraints = this.constraints;

		if(parseInt(this.state.jenisPengguna) === 2) {
			data.namaEselon = form.nama_eselon.value;
			data.kode = form.kode_eselon.value;
			constraints['namaEselon'] = { presence: true };
			delete constraints['namaSatker'];
		}

		if(parseInt(this.state.jenisPengguna) === 3) {
			data.namaSatker = form.satuan_kerja.value;
			data.kode = form.kode_satuan_kerja.value;

			data.parent = {
				userId: form.eselon.value
			};

			constraints['namaSatker'] = { presence: true };
			delete constraints['namaEselon'];
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
			axios.post('/api/user/update', data)
				.then(response => {
					// Notification
					const toasts = this.state.toasts.slice();
					toasts.push({ text: "SUCCESS: Data berhasil disimpan." });
					this.setState({ toasts });

					setTimeout(function () {
						window.location.replace('/secure/users')
					}, 2000);
				})
				.catch(e => {
					console.error(e);
					const toasts = this.state.toasts.slice();
					toasts.push({ text: `ERROR: ${e.response.data.error.message}.` });
					this.setState({ toasts, isLoading: false  });
				})
		}
	}

	onInputChange(key, value) {

		let newState = {
			[key]: value
		};

		this.setState(newState);
	}

	render() {

		const _this = this;

		const jenisPengguna = [{
			id: 2,
			name: "Eselon",
		}, {
			id: 3,
			name: "Satuan Kerja"
		}];

		let eselonDisplay = 'none';
		let satkerDisplay = 'none';

		if(parseInt(this.state.jenisPengguna) === 2) {
			eselonDisplay = 'flex';
		}

		if(parseInt(this.state.jenisPengguna) === 3) {
			satkerDisplay = 'flex';
		}

		return (
			<Layout title="Ubah Profil Pengguna Baru" subtitle="Ubah data profile pengguna">
				<form onSubmit={this.onFormSubmit}>
					<FormPanel>
						<header>
							<h4>Data Profil Pengguna </h4>
						</header>
						<FieldRow
							label="Nama Pengguna"
							input={<TextField
								onChange={function (value) {
								_this.onInputChange('nama', value);
								}}
								error={this.state.namaError}
								errorText={this.state.namaErrorText}
								name="nama_pengguna" value={this.state.nama} required placeholder="Nama Pengguna"/>}
						/>
						<FieldRow
							label="Handphone"
							input={<TextField
								onChange={function (value) {
									_this.onInputChange('phone', value);
								}}
								error={this.state.phoneError}
								errorText={this.state.phoneErrorText}
								name="hp"  value={this.state.phone} required placeholder="08xxxxxxxxx"/>}
						/>
						<FieldRow
							label="Email"
							input={<TextField
								onChange={function (value) {
									_this.onInputChange('email', value);
								}}
								error={this.state.emailError}
								errorText={this.state.emailErrorText}
								name="email"
								value={this.state.email} required placeholder="pengguna@email.com"/>}
						/>
						<FieldRow
							label="Password"
							input={<TextField
								onChange={function (value) {
									_this.onInputChange('password', value);
								}}
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
								onChange={function (value) {
									_this.onInputChange('namaAtasan', value);
								}}
								error={this.state.namaAtasanError}
								errorText={this.state.namaAtasanErrorText}
								name="nama_atasan"value={this.state.namaAtasan} required placeholder="Nama Atasan"/>}
						/>
						<FieldRow
							label="Handphone Atasan"
							input={<TextField
								onChange={function (value) {
									_this.onInputChange('handPhoneAtasan', value);
								}}
								error={this.state.handPhoneAtasanError}
								errorText={this.state.handPhoneAtasanErrorText}
								name="hp_atasan"  value={this.state.handPhoneAtasan} required placeholder="08xxxxxxxxx"/>}
						/>
						<div className="md-grid">
							<div className="md-cell md-cell--2" style={{marginTop: '18px'}}>
								<label>Jenis Pengguna</label>
							</div>
							<SelectField
								onChange={function (value) {
									console.log("change", value);
									_this.onInputChange('jenisPengguna', value);
								}}
								error={this.state.jenisPenggunaError}
								errorText={this.state.jenisPenggunaErrorText}
								name="jenis_pengguna"
								id="jenis_pengguna"
								label={false}
								value={this.state.jenisPengguna}
								required
								placeholder="Pilih jenis Pengguna"
								menuItems={jenisPengguna}
								itemLabel="name"
								itemValue="id" className="md-cell md-cell--5" />
						</div>
						<FieldRow
							style={{display: eselonDisplay}}
							label="Eselon"
							input={<TextField
								onChange={function (value) {
									_this.onInputChange('namaEselon', value);
								}}
								error={this.state.namaEselonError}
								errorText={this.state.namaEselonErrorText}
								name="nama_eselon" value={this.state.namaEselon} required placeholder="Eselon"/>}
						/>
						<FieldRow
							style={{display: eselonDisplay}}
							label="Kode Eselon"
							input={<TextField
								onChange={function (value) {
									_this.onInputChange('kode', value);
								}}
								error={this.state.kodeError}
								errorText={this.state.kodeErrorText}
								name="kode_eselon" value={this.state.kode} placeholder="Kode Eselon"/>}
						/>
						<div className="md-grid" style={{display: satkerDisplay}} >
							<div className="md-cell md-cell--2" style={{marginTop: '18px'}}>
								<label>Eselon</label>
							</div>
							<SelectField
								onChange={function (value) {
									_this.onInputChange('eselon', value);
								}}
								error={this.state.eselonError}
								errorText={this.state.eselonErrorText}
								value={this.state.eselon}
								name="eselon"
								id="eselon"
								label={false}
								required
								placeholder="Pilih Eselon"
								menuItems={this.state.daftarEselon}
								itemLabel="kodeNnama"
								itemValue="id" className="md-cell md-cell--5" />
						</div>
						<FieldRow
							style={{display: satkerDisplay}}
							label="Satuan Kerja"
							input={<TextField
								onChange={function (value) {
									_this.onInputChange('namaSatker', value);
								}}
								error={this.state.namaSatkerError}
								errorText={this.state.namaSatkerErrorText}
								name="satuan_kerja" required value={this.state.namaSatker} placeholder="Satuan Kerja"/>}
						/>
						<FieldRow
							style={{display: satkerDisplay}}
							label="Kode Satuan Kerja"
							input={<TextField
								onChange={function (value) {
									_this.onInputChange('kode', value);
								}}
								error={this.state.kodeError}
								errorText={this.state.kodeErrorText}
								name="kode_satuan_kerja" value={this.state.kode} required placeholder="Kode Satuan Kerja"/>}
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

export default UserEdit;