import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

import './Table.css';

class Table extends React.Component {

	render() {
		return (
			<BootstrapTable bootstrap4
			                keyField={this.props.keyField}
			                data={ this.props.data }
			                columns={ this.props.columns }
			                selectRow={this.props.selectRow}
			                striped
			                hover
			                condensed
			                classes="drafterbit-table"
			                pagination={ paginationFactory() }
			/>
		);
	}
}

export default Table;