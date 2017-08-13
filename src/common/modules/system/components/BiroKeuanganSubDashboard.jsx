import React from 'react';
import axios from 'axios';
import Panel from '../../../modules/common/components/Panel';
import formatCurrency from '../../../formatCurrency';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import EselonSubDashboard from './EselonSubDashboard';

class BiroKeuanganSubDashboard extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			viewedEselonName: null,
			viewedEselon: null,
			tgrList: [],
			total: 0
		}

		this.setViewedEselon = this.setViewedEselon.bind(this);
	}

	componentDidMount() {
		axios.get('/api/tgr/sub-dashboard/biro-keuangan', {
			params: { userId: this.props.user.id }
		})
			.then(response => {
				this.setState({
					tgrList: response.data.tgrList,
					total: response.data.total,
				})
			})
	}

	setViewedEselon(userId, name) {
		this.setState({
			viewedEselon: userId,
			viewedEselonName: name
		})
	}

	render() {

		const rows = this.state.tgrList.map((item, i) => (
			<TableRow key={i}>
				<TableColumn>{i+1}</TableColumn>
				<TableColumn>{item.eselon}</TableColumn>
				<TableColumn>{formatCurrency(item.saldo)}</TableColumn>
				<TableColumn><a href="#" onClick={(e) => {
					e.preventDefault();
					this.setViewedEselon(item.userId, item.eselon);
				}}>Lihat</a></TableColumn>
			</TableRow>
		));

		if(this.state.viewedEselon !== null) {
			return <EselonSubDashboard onBackClick={()=>{
				this.setState({viewedEselon: null, viewedEselonName: null});
			}} eselon={this.state.viewedEselonName} user={{id: this.state.viewedEselon}} />
		}

		return (
			<Panel>
				<header className="md-cell md-cell--12">
					<h3 style={{ marginBottom: 0, display:'inline-block' }}>Seluruh Piutang TGR</h3>
				</header>
				<DataTable plain>
					<TableHeader>
						<TableRow>
							<TableColumn>#</TableColumn>
							<TableColumn>Eselon</TableColumn>
							<TableColumn>Jumlah Saldo Piutang</TableColumn>
							<TableColumn>Aksi</TableColumn>
						</TableRow>
					</TableHeader>
					<TableBody>
						{rows}
					</TableBody>
				</DataTable>
				<div style={{marginTop: '15px'}}>
					Total: <strong style={{fontWeight: '800'}}>{formatCurrency(this.state.total)}</strong>
				</div>
			</Panel>
		)
	}
}

export default BiroKeuanganSubDashboard;