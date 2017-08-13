import React from 'react';
import axios from 'axios';
import Panel from '../../../modules/common/components/Panel';
import formatCurrency from '../../../formatCurrency';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import Button from 'react-md/lib/Buttons';

class SatkerSubDashboard extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			tgrList: []
		};
	}

	componentDidMount() {
		axios.get('/api/tgr/list', {
			params: { userId: this.props.user.id }
		})
			.then(response => {
				this.setState({
					tgrList: response.data
				})
			})
	}

	render() {

		const rows = this.state.tgrList.map((item, i) => (
			<TableRow key={i}>
				<TableColumn>{i+1}</TableColumn>
				<TableColumn>{item.nomorSktjm}</TableColumn>
				<TableColumn>{item.tanggalSktjm}</TableColumn>
				<TableColumn>{item.namaPegawai}</TableColumn>
				<TableColumn>{formatCurrency(item.saldoPiutang.saldo)}</TableColumn>
				<TableColumn><a href={"/secure/tgr/"+item.id}>Lihat</a></TableColumn>
			</TableRow>
		));

		return (
			<Panel>
				{this.props.satker &&
				<header className="md-cell md-cell--12">
					<Button href="#" flat label="<< KEMBALI" onClick={(e)=> {
						e.preventDefault();
						if(typeof this.props.onBackClick == 'function') {
							this.props.onBackClick();
						}
					}}/>
					<h3 style={{textAlign: 'center'}}>Daftar Piutang TGR {this.props.satker}</h3>
				</header>
				}

				{this.props.satker &&
					<header className="md-cell md-cell--12">
						<h3 style={{marginBottom: 0, display: 'inline-block'}}>Daftar Piutang TGR</h3>
					</header>
				}
				<DataTable plain>
					<TableHeader>
						<TableRow>
							<TableColumn>No</TableColumn>
							<TableColumn>No SKJTM</TableColumn>
							<TableColumn>Tanggal</TableColumn>
							<TableColumn>Nama Pegawai</TableColumn>
							<TableColumn>Saldo Piutang</TableColumn>
							<TableColumn>Aksi</TableColumn>
						</TableRow>
					</TableHeader>
					<TableBody>
						{rows}
					</TableBody>
				</DataTable>
			</Panel>
		)
	}
}

export default SatkerSubDashboard;