import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { withRouter, Link } from 'react-router-dom';

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
						<PaginationItem>
							<PaginationLink href="#" >
								&laquo;
							</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink previous href="#" >
								&lsaquo;
							</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink href="#">
								1
							</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<Link className="page-link" to={this.props.match.url+"?page=2"}>
								2
							</Link>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink href="#">
								3
							</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink previous href="#" >
								&lsaquo;
							</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink href="#" >
								&raquo;
							</PaginationLink>
						</PaginationItem>
				</Pagination>
			</div>
		);
	}
}

export default withRouter(Table);