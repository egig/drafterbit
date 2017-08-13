import React from 'react';
import Layout from '../../common/components/Layout';
import Panel from '../../common/components/Panel';
import Button from 'react-md/lib/Buttons';
import { connect } from  'react-redux';
import axios from 'axios';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import formatCurrency from '../../../formatCurrency';
import BiroKeuanganSubDashboard from './BiroKeuanganSubDashboard';
import EselonSubDashboard from './EselonSubDashboard';
import SatkerSubDashboard from './SatkerSubDashboard';

class Dashboard extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			tgrList: [],
			dashboardList: []
		}
	}

	componentDidMount() {
		axios.get('/api/tgr/dashboard', {
			params: { userId: this.props.user.id }
		})
			.then(response => {
				this.setState({
					dashboardList: response.data.dashboardList
				})
			});
	}

	render(){

		const rows = this.state.dashboardList.map((item, i) => (
			<TableRow key={i}>
				<TableColumn>{i+1}</TableColumn>
				<TableColumn>{item.namaPegawai}</TableColumn>
				<TableColumn>{formatCurrency(item.nilaiTgr)}</TableColumn>
				<TableColumn>{formatCurrency(item.saldoPiutang)}</TableColumn>
				<TableColumn>{formatCurrency(item.tagihanJatuhTempo)}</TableColumn>
				<TableColumn>{formatCurrency(item.lancar)}</TableColumn>
				<TableColumn>{formatCurrency(item.kurangLancar)}</TableColumn>
				<TableColumn>{formatCurrency(item.diragukan)}</TableColumn>
				<TableColumn>{formatCurrency(item.macet)}</TableColumn>
			</TableRow>
		));

		return (
			<Layout title="Dashboard" subtitle="Monitor seluruh proses bisnis" >
				<div className="md-grid" style={{
					marginLeft: '-16px',
					marginRight: '-16px'
				}}>
					<div className="md-cell md-cell--6">
						<Panel>
							Selamat Datang {this.props.user.nama} !
							<br/>
							<br/>

							{(this.props.user.tipeUser == 1) &&
								<div>
									<strong>Biro Keuangan</strong>
									<div>{this.props.user.kode}</div>
								</div>
							}

							{(this.props.user.tipeUser.id == 2) &&
							<div>
								<div>User Eselon</div>
								<strong style={{fontWeight: '800'}}>{this.props.user.userEselon.kode} - {this.props.user.userEselon.nama}</strong>
							</div>
							}

							{(this.props.user.tipeUser.id == 3) &&
							<div>
								<div>Satuan Kerja</div>
								<strong style={{fontWeight: '800'}}>{this.props.user.userSatker.kode} - {this.props.user.userSatker.nama}</strong>
							</div>
							}

						</Panel>
					</div>
					<div className="md-cell md-cell--6">
						{(this.props.user.tipeUser.id == 3) &&
						<Button style={{
							height: '54px',
							width: '100%'
						}} href="/secure/tgr/create" raised primary label="Buat Piutang TGR Baru" iconClassName="fa fa-list-alt" />
						}
						{(this.props.user.tipeUser.id == 1) &&
						<Button style={{
							height: '54px',
							width: '100%',
							backgroundColor: 'lightseagreen'
						}} href="/secure/users/create" raised primary label="Buat Pengguna TGR Baru" iconClassName="fa fa-user-circle-o" />
						}
					</div>
				</div>

				<div style={{ marginBottom: '10px' }}>
					{(this.props.user.tipeUser.id == 1) &&
						<BiroKeuanganSubDashboard user={this.props.user} />
					}

					{(this.props.user.tipeUser.id == 2) &&
						<EselonSubDashboard user={this.props.user} />
					}

					{(this.props.user.tipeUser.id == 3) &&
						<SatkerSubDashboard user={this.props.user} />
					}
				</div>

				{(this.props.user.tipeUser.id == 3) &&
				<div>
					<Panel>
						<header className="md-cell md-cell--12">
							<h3 style={{ marginBottom: 0, display:'inline-block' }}>Kualitas Piutang TGR</h3>
							<Button href={`/secure/tgr`}
							        flat
							        label="SELENGKAPNYA"
							        style={{ float: 'right' }}/>
						</header>
						<DataTable plain>
							<TableHeader>
								<TableRow >
									<TableColumn>No</TableColumn>
									<TableColumn style={{ whiteSpace: 'normal' }}>Nama Pegawai</TableColumn>
									<TableColumn>Nilai TGR</TableColumn>
									<TableColumn style={{ whiteSpace: 'normal' }}>Saldo Piutang</TableColumn>
									<TableColumn style={{ whiteSpace: 'normal' }}>Tagihan Jatuh Tempo</TableColumn>
									<TableColumn>Lancar</TableColumn>
									<TableColumn style={{ whiteSpace: 'normal' }}>Kurang Lancar</TableColumn>
									<TableColumn>Diragukan</TableColumn>
									<TableColumn>Macet</TableColumn>
								</TableRow>
							</TableHeader>
							<TableBody>
								{rows}
							</TableBody>
						</DataTable>
					</Panel>
				</div>
				}
			</Layout>
		)
	}
}

export default connect(function (state) {
	return {
		user: state.user.currentUser
	}
})(Dashboard);