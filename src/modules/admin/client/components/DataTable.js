import React from 'react';
import { Input, Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import createPagination from './createPagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';

import './DataTable.css';

function renderCaret(dataField, sortBy, sortDir) {
    if(sortBy == dataField) {
        if(sortDir == 'asc') {
            return <FontAwesomeIcon icon={faSortUp} className="float-right" />;
        }

        return <FontAwesomeIcon icon={faSortDown} className="float-right" />;
    }
    return <FontAwesomeIcon icon={faSort} className="float-right" color="#cccccc" />;
}


class DataTable extends React.Component {

    render() {

        let {
            select,
            data,
            onSort,
            sortBy,
            sortDir,
            onRowClick
        } = this.props;

        return (
            <div>
                <div className="DataTable-search-widget">
                    <Input type="text" placeholder="search" className=""/>
                </div>
                <Table size="sm" className="drafterbit-table" bordered striped hover responsive>
                    <thead>
                        <tr>
                            { select &&
                            <th>
                                <input
                                    onChange={e => {
                                        select.onSelectAll(e.target.checked, this.props.data);
                                    }}
                                    type="checkbox"
                                    ref={(input) => {
                                        if (input != null) {
                                            input.indeterminate = (!!select.selected.length) && (select.selected.length < data.length);
                                        }}
                                    }
                                    checked={select.selected.length == data.length}
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
                        {/*<tr>*/}
                        {/*{ select && <td /> }*/}
                        {/*/!*{this.props.columns.map((c,i) => {*!/*/}
                        {/*/!*return (*!/*/}
                        {/*/!*<td key={i}>*!/*/}
                        {/*/!*<Input bsSize="sm" value={this.props.filterObject[c.dataField] ? this.props.filterObject[c.dataField] : ''} onChange={e => {*!/*/}
                        {/*/!*this.props.onFilterChange(c.dataField, e.target.value);*!/*/}
                        {/*/!*}}/>*!/*/}
                        {/*/!*</td>*!/*/}
                        {/*/!*);*!/*/}
                        {/*/!*})}*!/*/}
                        {/*/!*<td>*!/*/}
                        {/*/!*<Button size="sm" color="primary" className="mr-1" onClick={() => {*!/*/}
                        {/**/}
                        {/*/!*let filterObj = {};*!/*/}
                        {/*/!*Object.keys(this.props.filterObject).forEach((name) => {*!/*/}
                        {/*/!*let v = this.props.filterObject[name];*!/*/}
                        {/*/!*if(v) {*!/*/}
                        {/*/!*filterObj[name] = this.props.filterObject[name];*!/*/}
                        {/*/!*}*!/*/}
                        {/*/!*});*!/*/}

                        {/*/!*this.props.onApplyFilter(filterObj);*!/*/}
                        {/*/!*}}><FontAwesomeIcon icon={faFilter}/></Button>*!/*/}
                        {/*/!*<Button size="sm" onClick={() => {*!/*/}
                        {/*/!*this.props.onReset();*!/*/}
                        {/*/!*}}><FontAwesomeIcon icon={faRedo}/></Button>*!/*/}
                        {/*/!*</td>*!/*/}
                        {/*</tr>*/}
                        {
                            this.props.data.map((d,i) => {
                                return (
                                    <tr key={i} >
                                        {select &&
                                        <td><input onChange={e => {
                                            select.onSelect(e.target.checked, d);
                                        }} checked={select.selected.indexOf(d[this.props.idField]) !== -1} type="checkbox" />
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
	              {this.props.totalPageCount > 0 &&
	              <Pagination className="float-right d-inline-block" size="sm" aria-label="Page navigation example">
		              {createPagination(this.props.currentPage, this.props.totalPageCount).map((p,i) => {
			              return (
				              <PaginationItem key={i} disabled={isNaN(p)} active={this.props.currentPage == p}>
					              {this.props.renderPaginationLink(p)}
				              </PaginationItem>
			              );
		              })}
	              </Pagination>
	              }
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
    filterObject: {},
    // select: {
    // 	selected: [],
    // 	onSelect: function (d) {
    //
    // 	},
    // 	onSelectAll: function (d) {
    //
    // 	},
    // },
    select: false,
    onRowClick: function (d) {

    },
    onSort: function (dataField, sortDir) {

    },
    onApplyFilter: function (filterObject) {

    },
    onFilterChange: function (dataField, value) {

    },
    onReset: function () {

    },
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