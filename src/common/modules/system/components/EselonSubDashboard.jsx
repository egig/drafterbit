import React from 'react';
import axios from 'axios';
import Panel from '../../../modules/common/components/Panel';
import formatCurrency from '../../../formatCurrency';
import Button from 'react-md/lib/Buttons/Button';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import SatkerSubDashboard from './SatkerSubDashboard';

class EselonSubDashboard extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			viewedSatkerId: null,
			viewedSatkerName: null,
			tgrList: [],
			total: 0
		}
		this.setViewedSatker = this.setViewedSatker.bind(this);
	}

	componentDidMount() {
		axios.get('/api/tgr/sub-dashboard/eselon', {
			params: { userId: this.props.user.id }
		})
			.then(response => {
				this.setState({
					tgrList: response.data.tgrList,
					total: response.data.total
				})
			})
	}

	setViewedSatker(userId, name) {
		this.setState({
			viewedSatkerId: userId,
			viewedSatkerName: name
		})
	}


	render() {

		if(this.state.viewedSatkerId !== null) {
			return <SatkerSubDashboard onBackClick={()=>{
				this.setState({viewedSatkerId: null, viewedSatkerName: null});
			}} satker={this.state.viewedSatkerName} user={{id: this.state.viewedSatkerId}} />
		}

		const rows = this.state.tgrList.map((item, i) => (
			<TableRow key={i}>
				<TableColumn>{i+1}</TableColumn>
				<TableColumn>{item.satker}</TableColumn>
				<TableColumn>{formatCurrency(item.saldo)}</TableColumn>
				{!this.props.eselon &&
					<TableColumn><a href="#" onClick={(e) => {
						e.preventDefault();
						this.setViewedSatker(item.userId, item.satker);
					}} >Lihat</a></TableColumn>
				}
			</TableRow>
		));

		return (
			<Panel>
				{this.props.eselon &&
					<header className="md-cell md-cell--12">
						<Button href="#" flat label="<< KEMBALI" onClick={(e)=> {
							e.preventDefault();
							if(typeof this.props.onBackClick == 'function') {
								this.props.onBackClick();
							}
						}}/>
						<h3 style={{textAlign: 'center'}}>Daftar Piutang TGR {this.props.eselon}</h3>
					</header>
				}
				{!this.props.eselon &&
					<header className="md-cell md-cell--12">
						<h3 style={{marginBottom: 0, display: 'inline-block'}}>Seluruh Piutang TGR</h3>
					</header>
				}
				<DataTable plain>
					<TableHeader>
						<TableRow>
							<TableColumn>#</TableColumn>
							<TableColumn>Satuan Kerja</TableColumn>
							<TableColumn>Jumlah Saldo Piutang</TableColumn>
							{!this.props.eselon &&
								<TableColumn>Aksi</TableColumn>
							}
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

export default EselonSubDashboard;