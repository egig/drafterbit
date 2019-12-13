import querystring from 'querystring';
import React, { Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import withDrafterbit from '../withDrafterbit';
import DataTable from './DataTable';
import _ from 'lodash';

const FilterQuery = require('../../../../../FilterQuery');

class TablePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: [],
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        let { location } = this.props;
        let nextLocation = nextProps.location;

        let qs = querystring.parse(location.search.substr(1));
        let nextQs = querystring.parse(nextLocation.search.substr(1));

        let isPathSame = (nextLocation.pathname === location.pathname);

        if(isPathSame && _.isEqual(qs, nextQs)) {
            return;
        }

        this.loadContents(nextProps);
    }

    loadContents = (props) => {
        let qs = querystring.parse(props.location.search.substr(1));
        let sortBy = qs['sort_by'];
        let sortDir = qs['sort_dir'];
        let fqStr = qs['fq'];
        let page = qs['page'];
        this.props.loadContents(props.match, page, sortBy, sortDir, fqStr, qs);
    };

    componentDidMount() {
        this.loadContents(this.props)
    }

    handleOnSelect = (isSelect, row) => {
        this.setState(() => ({
            selected: isSelect ? [...this.state.selected, row._id] :
                this.state.selected.filter(x => x !== row._id)
        }));
    };

    handleOnSelectAll = (isSelect, rows) => {
        const ids = rows.map(r => r._id);
        this.setState(() => ({
            selected: isSelect ? ids : []
        }));
    };

    handleSort = (dataField, sortDir) => {
        this.modifyQS((qs) => {
            let newSortDir = (sortDir === 'desc') ? 'asc' : 'desc';
            qs['sort_by'] = dataField;
            qs['sort_dir'] = newSortDir;
            return qs;
        });
    };

    modifyQS = (fn) => {
        let {
            location,
            match,
            history
        } = this.props;

        let qs = querystring.parse(location.search.substr(1));
        qs = fn(qs);
        let newLink = match.url + "?" + querystring.stringify(qs);
        history.push(newLink);
    };

    applyFilter = (k, v) => {
        this.modifyFQ((fqObj) => {
            fqObj.addFilter(k, v);
        });
    };

    onFilterChange = (dataField, value) => {
        let d = {};
        d[dataField] = value;

        this.setState((prevState) => {
            return {
                filterObject: Object.assign({}, prevState.filterObject, d)
            }
        })
    };

    onReset = () => {
        let qs = querystring.parse(this.props.location.search.substr(1));
        delete qs['fq'];
        let newLink = this.props.match.url + "?" + querystring.stringify(qs);
        this.props.history.push(newLink);
    };

    handleDelete = () => {
        this.props.handleDelete(this.state.selected);
    };

    onDeleteFilter = (k, v) => {
        this.modifyFQ((fqObj) => {
            fqObj.removeFilter(k, v);
        });
    };

    popFilter = () => {
        this.modifyFQ((fqObj) => {
            fqObj.pop();
        });
    };

    modifyFQ(fn) {
        this.modifyQS((qs) => {
            let fqObj = FilterQuery.fromString(qs['fq']);
            fn(fqObj);
            let fqStr = fqObj.toString();
            if (fqStr === "") {
                delete qs['fq'];
                return qs;
            }

            qs['fq'] = fqStr;
            return qs;
        });
    }

    render() {

        let {
            location,
            data,
            columns,
            onClickAdd,
            addButton,
            select
        } = this.props;

        let {
            selected
        } = this.state;

        let qs = querystring.parse(location.search.substr(1));
        let sortBy = qs['sort_by'];
        let sortDir = qs['sort_dir'];
        let page = !!qs['page'] ? qs['page'] : 1;
        let filterObjects = FilterQuery.fromString(qs['fq']).getFilters();

        return (
            <Fragment>
                <div className="row">
                    <div className="col-md-6">
                        <h2>{this.props.headerText}</h2>
                    </div>
                    <div className="col-md-6">
                        {onClickAdd &&
                            <button className="btn btn btn-outline-success mb-2 btn-sm float-right" onClick={onClickAdd} >{this.props.addText}</button>
                        }
                        {!!selected.length &&
                            <button className="btn btn-outline-danger mr-2 mb-2 btn-sm float-right"  onClick={this.handleDelete} >
                                {this.props.deleteText} {selected.length} items
                            </button>
                        }
                    </div>
                </div>
                    <DataTable
                        idField="_id"
                        data={ data }
                        columns={ columns }
                        select={select}
                        selected={selected}
                        onSelect={this.handleOnSelect}
                        onSelectAll={this.handleOnSelectAll}
                        sortBy={sortBy}
                        sortDir={sortDir}
                        onSort={this.handleSort}
                        onApplyFilter={this.applyFilter}
                        onFilterChange={this.onFilterChange}
                        onReset={this.onReset}
                        filterObjects={filterObjects}
                        currentPage={page}
                        totalPageCount={Math.ceil(this.props.contentCount/10)}
                        renderPaginationLink={(p) => (
                            <Link className="page-link" to={this.props.match.url+"?page="+p}>{p}</Link>
                        )}
                        onRowClick={this.props.onRowClick}
                        onDeleteFilter={this.onDeleteFilter}
                        popFilter={this.popFilter}
                        render={this.props.render}
                    />
            </Fragment>
        );
    }
}

TablePage.defaultProps = {
    addButton: true,
    select: false,
    headerText: "Untitled Page",
    addText: "Add New",
    deleteText: "Delete"
};

export default withDrafterbit(withRouter(TablePage));