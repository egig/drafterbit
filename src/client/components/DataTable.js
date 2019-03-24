import React from 'react';
import { Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import createPagination from './createPagination';

import './DataTable.css';

class DataTable extends React.Component {

	render() {

		return (
			<div>
				<Table className="drafterbit-table" size="sm" bordered striped hover>
					<thead>
						<tr>
							<th>
								<input
									onChange={e => {
										this.props.onSelectAll(e.target.checked, this.props.data);
									}}
									type="checkbox"
									ref={(input) => {
					          if (input != null) {
					          	input.indeterminate = (!!this.props.selected.length) && (this.props.selected.length < this.props.data.length);
					          }}
									}
									checked={this.props.selected.length == this.props.data.length}
								/>
							</th>
							{this.props.columns.map((c,i) => {
								return <th key={i}>{c.text} <i className="fa fa-fw fa-sort"/> </th>
							})}
						</tr>
					</thead>
					<tbody>
					{
						this.props.data.map((d,i) => {
							return (
								<tr key={i}>
									<th><input onChange={e => {
										this.props.onSelect(e.target.checked, d)
									}} checked={this.props.selected.indexOf(d[this.props.idField]) !== -1} type="checkbox" /></th>
									{this.props.columns.map((c,i) => {
										if(typeof c.formatter == 'function') {
											return c.formatter(d[c.dataField], d);
										} else {
											return <td key={i}>{d[c.dataField]}</td>
										}
									})}
								</tr>
							);
						})
					}
					</tbody>
				</Table>
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

DataTable.defaultProps = {
	idField: "_id",
	data: [],
	selected: [],
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

export default DataTable;