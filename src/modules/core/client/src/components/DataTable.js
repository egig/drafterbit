import React from 'react';
import { Button, Input, Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import createPagination from './createPagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown, faFilter, faRedo } from '@fortawesome/free-solid-svg-icons';
import Actions from './DataTable/Actions';
import TableFilter from './TableFilter';

import './DataTable.css';

function renderCaret(dataField, sortBy, sortDir) {
    if(sortBy === dataField) {
        if(sortDir === 'asc') {
            return <FontAwesomeIcon icon={faSortUp} className="float-right" />;
        }

        return <FontAwesomeIcon icon={faSortDown} className="float-right" />;
    }
    return <FontAwesomeIcon icon={faSort} className="float-right" color="#cccccc" />;
}


class DataTable extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            typedQ: ""
        }
    }

    onFilterKeyUp = (e) => {
        // Enter
        if (e.keyCode === 13) {
            if (this.state.typedQ !== "") {
                return this.onApplyFilter("q", this.state.typedQ);
            }
        }

        // Backspace
        if (e.keyCode === 8) {
            if (this.state.typedQ === "") {
                return this.props.popFilter();
            }
        }
    };

    onFilterChange = (e) => {
        this.setState({
            typedQ: e.target.value
        })
    };

    onApplyFilter = (k, v) => {
        this.props.onApplyFilter(k, v);
        this.setState({
            typedQ: ""
        })
    };

    deleteFilter = (k, v) => {
        this.props.onDeleteFilter(k, v);
    };

    renderTableFilter = () => {
        return <TableFilter
            onFilterKeyUp={this.onFilterKeyUp}
            onFilterChange={this.onFilterChange}
            deleteFilter={this.deleteFilter}
            onApplyFilter={this.onApplyFilter}
            columns={this.props.columns}
            filterObjects={this.props.filterObjects}
            typedQ={this.state.typedQ} />
    };

    renderTable = () => {
        let {
            select,
            selected,
            data,
            onSort,
            sortBy,
            sortDir,
        } = this.props;

        return (
            <Table size="sm" className="drafterbit-table" bordered striped hover responsive>
                <thead>
                <tr>
                    { select &&
                    <th>
                        <input
                            onChange={e => {
                                this.props.onSelectAll(e.target.checked, this.props.data);
                            }}
                            type="checkbox"
                            ref={(input) => {
                                if (input != null) {
                                    input.indeterminate = (!!selected.length) && (selected.length < data.length);
                                }}
                            }
                            checked={selected.length === data.length}
                        />
                    </th>
                    }
                    {this.props.columns.map((c,i) => {
                        return <th width={c.width ? c.width : ''} onClick={e => {
                            onSort(c.dataField, sortDir);
                        }} style={{cursor: 'pointer'}} key={i}>
                            {c.text}
                            {renderCaret(c.dataField, sortBy, sortDir)}
                        </th>;
                    })}
                    {/*<th width="100px">Actions</th>*/}
                </tr>
                </thead>
                <tbody>
                {
                    this.props.data.map((d,i) => {
                        return (
                            <tr key={i} >
                                {select &&
                                <td><input onChange={e => {
                                    this.props.onSelect(e.target.checked, d);
                                }} checked={this.props.selected.indexOf(d[this.props.idField]) !== -1} type="checkbox" />
                                </td>
                                }
                                {this.props.columns.map((c,i) => {
                                    return (
                                        <td key={i}>
                                            {(() => {
                                                if(typeof c.formatter == 'function') {
                                                    return c.formatter(d[c.dataField], d);
                                                } else {
                                                    return d[c.dataField];
                                                }
                                            })()}
                                        </td>
                                    );
                                })}
                                {/*<td>*/}
                                {/*<Actions onEdit={() => {*/}
                                {/*onRowClick(d)*/}
                                {/*}} />*/}
                                {/*</td>*/}
                            </tr>
                        );
                    })
                }
                </tbody>
            </Table>
        )
    };

    renderPagination = () => {
        if (!!this.props.totalPageCount) {
            return (
                <Pagination className="float-right d-inline-block" size="sm" aria-label="Page navigation example">
                    {createPagination(this.props.currentPage, this.props.totalPageCount).map((p,i) => {
                        return (
                            <PaginationItem key={i} disabled={isNaN(p)} active={this.props.currentPage === p}>
                                {this.props.renderPaginationLink(p)}
                            </PaginationItem>
                        );
                    })}
                </Pagination>
            )
        }
    };

    render() {
        let filter = this.renderTableFilter();
        let table = this.renderTable();
        let pagination = this.renderPagination();
        if (typeof this.props.render == "function" ) {
            return this.props.render(filter, table, pagination)
        }

        return (
            <div>
                {filter}
                {table}
                {pagination}
            </div>
        );
    }
}

DataTable.defaultProps = {
    idField: '_id',
    data: [],
    columns: [],
    currentPage: 1,
    totalPageCount: 1,
    filterObjects: {},
    select: false,
    selected: [],
    onSelect: function (d) {

    },
    onSelectAll: function (d) {

    },
    onRowClick: function (d) {

    },
    onSort: function (dataField, sortDir) {
		
    },
    onApplyFilter: function (k, v) {

    },
    onFilterChange: function (dataField, value) {

    },
    onReset: function () {

    },
    onDeleteFilter: function(k, v) {

    },
    popFilter: () => {},
    sortBy: null,
    sortDir: null,
    renderPaginationLink: function (p) {
        return (
            <PaginationLink className="page-link" href={p}>
                {p}
            </PaginationLink>
        );
    }
};

export default DataTable;