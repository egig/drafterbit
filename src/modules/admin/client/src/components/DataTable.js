import React from 'react';
import { Button, Input, Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import createPagination from './createPagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown, faFilter, faRedo } from '@fortawesome/free-solid-svg-icons';
import Actions from './DataTable/Actions';

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
        if (e.keyCode === 13) {
            return this.onApplyFilter("q", this.state.typedQ);
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

    render() {

    	let {
		    select,
		    data,
		    onSort,
		    sortBy,
		    sortDir,
		    onRowClick,
            filterObjects
	    } = this.props;

        return (
            <div>
	            <div className="DataTable-search-widget">
                    <div>{filterObjects.map((o,i) => {
                        return <div key={i}>{o.k}={o.v} <span onClick={e => {
                            this.deleteFilter(o.k, o.v);
                        }}>&times;</span></div>
                    })}</div>
                    <input value={this.state.typedQ} type="text" placeholder="Filter" className="" onChange={this.onFilterChange} onKeyUp={this.onFilterKeyUp}/>
                    {this.state.typedQ &&
                        <div>
                            {this.props.columns.map((c,i) => {
                                let fStr = `${c.text}:${this.state.typedQ}`;
                                return <div key={i} onClick={e => {
                                    this.onApplyFilter(c.text, this.state.typedQ);
                                }}>{fStr}</div>
                            })}
                        </div>
                    }
	            </div>
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
															            input.indeterminate = (!!this.props.selected.length) && (this.props.selected.length < data.length);
															          }}
	                                    }
				                        checked={this.props.selected.length == data.length}
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
                {!!this.props.totalPageCount &&
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