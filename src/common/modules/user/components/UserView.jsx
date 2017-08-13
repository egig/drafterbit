import React from 'react';
import TextField from 'react-md/lib/TextFields/TextField';
import Button from 'react-md/lib/Buttons/Button';
import axios from 'axios';
import Paper from 'react-md/lib/Papers/Paper';
import FontIcon from 'react-md/lib/FontIcons/FontIcon';
import Layout from '../../common/components/Layout';
import Panel from '../../common/components/Panel';


class UserView extends React.Component {

	constructor(props) {
		super(props);

		this.state = {

			id: '',
			nama: '',
			email: '',
			password: '',
			phone: '',
			namaAtasan: '',
			handPhoneAtasan: '',
			jenisPengguna: '',
			namaEselon: '',
			eselon: '',
			namaSatker: '',
			kode: '',
		}
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
	}

	render() {

		return (
			<Layout title="Profil Pengguna" subtitle="Informasi Tentang Pengguna">
				<Panel>
					<header className="md-cell md-cell--12">
						<h3 style={{ marginBottom: 0, display:'inline-block' }}>Profile Pengguna</h3>
						<Button href={"/secure/users/edit/"+this.state.id} icon style={{float: 'right'}} >edit</Button>
					</header>
					<div>
						<FieldRow
							label="Nama Pengguna"
							value={this.state.nama}
						/>
						<FieldRow
							label="Handphone"
							value={this.state.phone}
						/>
						<FieldRow
							label="Email"
							value={this.state.email}
						/>
						<FieldRow
							label="Nama Atasan"
							value={this.state.namaAtasan}
						/>
						<FieldRow
							label="Handphone Atasan"
							value={this.state.handPhoneAtasan}
						/>
						<FieldRow
							label="Status"
							value="ACTIVE"
						/>
						<FieldRow
							label="Eselon"
							value={this.state.namaEselon}
						/>
						<FieldRow
							label="Kode Eselon"
							value={this.state.kode}
						/>
						<FieldRow
							label="Satuan Kerja"
							value={this.state.namaSatker}
						/>
						<FieldRow
							label="Kode Satuan Kerja"
							value={this.state.kode}
						/>
					</div>
				</Panel>
			</Layout>
		);
	}
}

const FieldRow  = function (props) {
	return(
		<div className="md-grid">
			<div className="md-cell md-cell--2">
				<strong>{props.label}</strong>
			</div>
			<div className="md-cell md-cell--5">
				{props.value}
			</div>
		</div>
	);
};

export default UserView;