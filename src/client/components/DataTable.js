import React from 'react';
import { Button, Input, Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import createPagination from './createPagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'

import './DataTable.css';

class DataTable extends React.Component {

	render() {

		function renderCaret(dataField, sortBy, sortDir) {
			if(sortBy == dataField) {
				if(sortDir == 'asc') {
					return <FontAwesomeIcon icon={faSortUp} className="float-right" />
				}

				return <FontAwesomeIcon icon={faSortDown} className="float-right" />
			}
			return <FontAwesomeIcon icon={faSort} className="float-right" color="#cccccc" />;
		}

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
								return <th onClick={e => {
									this.props.onSort(c.dataField, this.props.sortDir);
								}} style={{cursor: 'pointer'}} key={i}>
									{c.text}
									{renderCaret(c.dataField, this.props.sortBy, this.props.sortDir)}
								</th>
							})}
							<th>
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td />
							{this.props.columns.map((c,i) => {
								return (
									<td key={i}>
										<Input bsSize="sm" defaultValue={c.filterValue} onChange={e => {
											this.props.onFilterChange(c.dataField, e.target.value);
										}}/>
									</td>
								)
							})}
							<td width="150px">
								<Button size="sm" color="primary" className="mr-1" onClick={() => {

									let filterObj = {};
									Object.keys(this.props.filterObject).forEach((name) => {
										filterObj[name] = this.props.filterObject[name];
									});

									this.props.onApplyFilter(filterObj);
								}}>Apply</Button>
								<Button size="sm">Reset</Button>
							</td>
						</tr>
					{
						this.props.data.map((d,i) => {
							return (
								<tr key={i}>
									<td><input onChange={e => {
										this.props.onSelect(e.target.checked, d)
									}} checked={this.props.selected.indexOf(d[this.props.idField]) !== -1} type="checkbox" /></td>
									{this.props.columns.map((c,i) => {
										return (
											<td key={i}>
												{(() => {
													if(typeof c.formatter == 'function') {
														return c.formatter(d[c.dataField], d);
													} else {
														return d[c.dataField]
													}
												})()}
											</td>
										)
									})}
									<td>
										<Button size="sm" color="primary">Edit</Button>
									</td>
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
	onSort: function (dataField, sortDir) {
		
	},
	onApplyFilter: function (filterObject) {

	},
	onFilterChange: function (dataField, value) {

	},
	sortBy: null,
	sortDir: null,
	renderPaginationLink: function (p) {
		return (
			<PaginationLink className="page-link" href={p}>
				{p}
			</PaginationLink>
		)
	}
};

export default DataTable;