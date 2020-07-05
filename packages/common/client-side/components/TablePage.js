import querystring from 'querystring';
import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import withDrafterbit from '../withDrafterbit';
import _ from 'lodash';
import { Table, Button } from 'antd'


const FilterQuery = require('../../FilterQuery');

class TablePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: [],
            loading: false,
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

        this.setState({
            loading: true
        });
        this.loadContents(nextProps)
            .then(r => {
                this.setState({
                    loading: false
                })
            })
    }

    loadContents = (props) => {
        let qs = querystring.parse(props.location.search.substr(1));
        let sortBy = qs['sort_by'];
        let sortDir = qs['sort_dir'];
        let fqStr = qs['fq'];
        let page = qs['page'];
        return this.props.loadContents(props.match, page, sortBy, sortDir, fqStr, qs);
    };

    componentDidMount() {
        return this.loadContents(this.props).then(r => {
            this.setState({
                loading: false
            })
        })
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
            qs['sort_by'] = dataField;
            qs['sort_dir'] = sortDir;
            return qs;
        });
    };

    handlePage = (current, pageSize) => {
        this.modifyQS((qs) => {
            qs['page'] = current;
            qs['page_size'] = pageSize;
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

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);

                this.setState({
                    selected: selectedRows.map(s => s._id)
                });
            },
            getCheckboxProps: record => ({
                name: "_ids",
                value: record._id,
            }),
        };

        data = data.map(d => {
            d.key = d._id;
            return d;
        });

        // const onChange = page => {
        //     this.props.history.push(this.props.match.url + "?page=" + page)
        // };

        function itemRender(current, type, originalElement) {
            if (type === 'prev') {
                return <a>Previous</a>;
            }
            if (type === 'next') {
                return <a>Next</a>;
            }
            return originalElement;
        }


        const onChange = (pagination, filters, sorter, extra) => {
            console.log('params', pagination, filters, sorter, extra);
            if (extra.action === 'sort') {
                this.handleSort(sorter.field, sorter.order);
            }

            if (extra.action === 'paginate') {
                this.handlePage(pagination.current, pagination.pageSize);
            }
        };

        return (
            <Fragment>
                <div className="row">
                    <div className="col-md-6">
                        <h2>{this.props.headerText}</h2>
                    </div>
                    <div className="col-md-6" style={{display: "flex", justifyContent:"flex-end"}}>
                        {!!selected.length &&
                        <Button type="line" danger  onClick={this.handleDelete} >
                            {this.props.deleteText} {selected.length} items
                        </Button>
                        }
                        <span style={{marginLeft:"6px"}}/>
                        {onClickAdd &&
                            <Button type="primary" onClick={onClickAdd} >{this.props.addText}</Button>
                        }

                    </div>
                </div>

                <Table
                    bordered
                    size="small"
                    rowSelection={{
                        type: "checkbox",
                        ...rowSelection,
                    }}
                    columns={columns}
                    dataSource={data}
                    rowKey={record => record._id}
                    loading={this.state.loading}
                    onChange={onChange}
                    pagination={{
                        total:20,
                        pageSize:10,
                    }}
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