import querystring from 'querystring';
import React, { Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Card from './Card/Card';
import DataTable from './DataTable';
import withDrafterbit from '../withDrafterbit';
import _ from 'lodash';
import { parseFilterQuery, stringifyFilterQuery, mergeFilterObj} from '../common/filterQuery'

class TablePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: [],
        };

        this.handleOnSelect = this.handleOnSelect.bind(this);
        this.handleOnSelectAll = this.handleOnSelectAll.bind(this);
    }

    componentWillReceiveProps(nextProps, nextContext) {
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

    loadContents(props) {

        let nextQs = querystring.parse(props.location.search.substr(1));

        // let ctSlug = props.match.params.content_type_slug;
        let sortBy = nextQs['sort_by'];
        let sortDir = nextQs['sort_dir'];
        let fqStr = nextQs['fq'];
        let page = nextQs['page'];
        this.props.loadContents(props.match, page, sortBy, sortDir, fqStr);
    }

    componentDidMount() {
        this.loadContents(this.props)
    }

    handleOnSelect(isSelect, row) {
        if (isSelect) {
            this.setState(() => ({
                selected: [...this.state.selected, row._id]
            }));
        } else {
            this.setState(() => ({
                selected: this.state.selected.filter(x => x !== row._id)
            }));
        }
    }

    handleOnSelectAll = (isSelect, rows) => {
        const ids = rows.map(r => r._id);
        if (isSelect) {
            this.setState(() => ({
                selected: ids
            }));
        } else {
            this.setState(() => ({
                selected: []
            }));
        }
    };

    handleSort = (dataField, sortDir) => {

        let {
            location,
            match,
            history
        } = this.props;

        let qs = querystring.parse(location.search.substr(1));
        let newSortDir = (sortDir === 'desc') ? 'asc' : 'desc';
        qs['sort_by'] = dataField;
        qs['sort_dir'] = newSortDir;
        let newLink = match.url + "?" + querystring.stringify(qs);
        history.push(newLink);
    };

    applyFilter = (fObj) => {
        let qs = querystring.parse(this.props.location.search.substr(1));
        let filterObj = parseFilterQuery(qs['fq']);
        let newFq = mergeFilterObj(filterObj, fObj);
        qs['fq'] = stringifyFilterQuery(newFq);
        let newLink = this.props.match.url + "?" + querystring.stringify(qs);
        this.props.history.push(newLink);
    };

    onFilterChange = (dataField, value) => {
        let d = {};
        d[dataField] = value;

        this.setState((prevState) => {
            return {
                filterObject: Object.assign({}, prevState.filterObject, d)
            }
        })
        // TODO update query str instead
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

    render() {

        let {
            location,
            data,
            columns,
            onClickAdd,
            handleDelete,
            select
        } = this.props;

        let {
            selected
        } = this.state;

        let qs = querystring.parse(location.search.substr(1));
        let sortBy = qs['sort_by'];
        let sortDir = qs['sort_dir'];
        let page = !!qs['page'] ? qs['page'] : 1;
        let filterObject = parseFilterQuery(qs['fq']);

        return (
            <Fragment>
                <Card headerText="Contents">
                    <button className="btn btn-success mb-3" onClick={onClickAdd} >Add</button>
                    {!!selected.length &&
                        <button className="btn btn-danger ml-2 mb-3" onClick={this.handleDelete} >Delete</button>
                    }
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
                        filterObject={filterObject}
                        currentPage={page}
                        totalPageCount={Math.ceil(this.props.contentCount/10)}
                        renderPaginationLink={(p) => (
                            <Link className="page-link" to={this.props.match.url+"?page="+p}>{p}</Link>
                        )}
                        onRowClick={this.props.onRowClick}
                    />
                </Card>
            </Fragment>
        );
    }
}


export default withDrafterbit(withRouter(TablePage));