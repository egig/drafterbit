import React from 'react';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import UserIndexContainer from '../UserIndexContainer';
import Button from 'react-md/lib/Buttons/Button';
import Layout from '../../common/components/Layout';
import Panel from '../../common/components/Panel';

class UserIndex extends React.Component {

	componentDidMount() {
		this.props.actions.getUserList();
	}

	render() {

		let usersEselon = this.props.users.filter((item) => (item.tipeUserId == 2));
		let usersSatker = this.props.users.filter((item) => (item.tipeUserId == 3));

		const rowsEselon = usersEselon.map((user, i) => (
			<TableRow key={i}>
				<TableColumn>{i+1}</TableColumn>
				<TableColumn>{user.userEselon.kode} - {user.userEselon.nama}</TableColumn>
				<TableColumn>{user.nama}</TableColumn>
				<TableColumn>{user.email}</TableColumn>
				<TableColumn>{user.phone}</TableColumn>
				<TableColumn><a href={"/secure/users/"+user.id}>Lihat</a></TableColumn>
			</TableRow>
		));

		const rowsSatker = usersSatker.map((user, i) => (
			<TableRow key={i}>
				<TableColumn>{i+1}</TableColumn>
				<TableColumn>{user.userSatker.kode} - {user.userSatker.nama}</TableColumn>
				<TableColumn>{user.nama}</TableColumn>
				<TableColumn>{user.email}</TableColumn>
				<TableColumn>{user.phone}</TableColumn>
				<TableColumn><a href={"/secure/users/"+user.id}>Lihat</a></TableColumn>
			</TableRow>
		));

		return (
			<Layout title="Kelola Pengguna" subtitle="Daftar seluruh pengguna e-TGR">
			<div style={{marginBottom: '100px'}}>
				<div style={{ marginBottom: '10px' }}>
					<Panel>
						<header className="md-cell md-cell--12">
							<h3 style={{ marginBottom: 0, display:'inline-block' }}>Daftar Pengguna Eselon 1</h3>
						</header>
						<DataTable plain>
							<TableHeader>
								<TableRow>
									<TableColumn>No</TableColumn>
									<TableColumn>Nama Eselon</TableColumn>
									<TableColumn>Petugas</TableColumn>
									<TableColumn>Email</TableColumn>
									<TableColumn>Telp</TableColumn>
									<TableColumn>Aksi</TableColumn>
								</TableRow>
							</TableHeader>
							<TableBody>
								{rowsEselon}
							</TableBody>
						</DataTable>
					</Panel>
				</div>

				<div style={{ marginBottom: '10px' }}>
					<Panel>
						<header className="md-cell md-cell--12">
							<h3 style={{ marginBottom: 0, display:'inline-block' }}>Daftar Pengguna Satuan Kerja</h3>
						</header>
						<DataTable plain>
							<TableHeader>
								<TableRow>
									<TableColumn>No</TableColumn>
									<TableColumn>Nama Satker</TableColumn>
									<TableColumn>Petugas</TableColumn>
									<TableColumn>Email</TableColumn>
									<TableColumn>Telp</TableColumn>
									<TableColumn>Aksi</TableColumn>
								</TableRow>
							</TableHeader>
							<TableBody>
								{rowsSatker}
							</TableBody>
						</DataTable>
					</Panel>
				</div>
				<Button
					href="/secure/users/create"
					floating
					secondary
					fixed
				>add</Button>
			</div>
			</Layout>
		);
	}
}

export default UserIndexContainer(UserIndex);