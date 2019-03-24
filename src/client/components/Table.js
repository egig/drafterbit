import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import createPagination from './createPagination';

import './Table.css';

class Table extends React.Component {

	render() {

		const selectRow = {
			mode: 'checkbox',
			clickToSelect: true,
			selected: this.props.selected,
			onSelect: this.props.onSelect,
			onSelectAll: this.props.onSelectAll
		};

		return (
			<div>
				<BootstrapTable bootstrap4
				                keyField={this.props.keyField}
				                data={ this.props.data }
				                columns={ this.props.columns }
				                selectRow={selectRow}
				                striped
				                hover
				                condensed
				                classes="drafterbit-table"
				/>
				<Pagination className="float-right d-inline-block" size="sm" aria-label="Page navigation example">
					{createPagination(this.props.currentPage, this.props.totalPageCount).map((p,i) => {
						return (
							<PaginationItem key={i} disabled={isNaN(p)} active={this.props.currentPage == p}>
								{this.props.renderPaginationLink(p)}
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
	totalPageCount: 1,
	renderPaginationLink: function (p) {
		return (
			<PaginationLink className="page-link" href={p}>
				{p}
			</PaginationLink>
		)
	}
};

export default Table;