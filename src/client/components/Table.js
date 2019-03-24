import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { Pagination, PaginationItem } from 'reactstrap';
import { withRouter, Link } from 'react-router-dom';
import createPagination from './createPagination';

import './Table.css';

class Table extends React.Component {

	render() {
		return (
			<div>
				<BootstrapTable bootstrap4
				                keyField={this.props.keyField}
				                data={ this.props.data }
				                columns={ this.props.columns }
				                selectRow={this.props.selectRow}
				                striped
				                hover
				                condensed
				                classes="drafterbit-table"
				/>
				<Pagination className="float-right d-inline-block" size="sm" aria-label="Page navigation example">
					{createPagination(this.props.currentPage, this.props.totalPageCount).map((p,i) => {
						return (
							<PaginationItem key={i} disabled={isNaN(p)} active={this.props.currentPage == p}>
								<Link className="page-link" to={this.props.match.url+"?page="+p}>
									{p}
								</Link>
							</PaginationItem>
						)
					})}
				</Pagination>
			</div>
		);
	}
}

Table.defaultProps = {
	keyField: "_id",
	data: [],
	columns: [],
	currentPage: 1,
	totalPageCount: 1
}

export default withRouter(Table);