import querystring from 'querystring';
import React  from 'react';
import {withRouter} from 'react-router-dom';
import _ from 'lodash';
import { Row, Col, Table, Button, PageHeader, Card } from 'antd'
import TableFilter from './TableFilter';
import { LoadingOutlined } from '@ant-design/icons';
import FilterQuery from '../FilterQuery';

const LoadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

type Props = {
    history: any,
    location: any,
    match : any,
    loadContents: (page: number, pageSize: number, sortBy: string, sortDir: string, fqStr: string) => Promise<any>
    handleDelete?: any
    data: any
    columns: any
    onClickAdd?: any
    deleteText?: string
    contentCount: number
    addText?: string
    renderContent?: any
    headerText?: string
}

type State = {
    selected: any[],
    loading: boolean,
}

type modifyQSParam = (a: querystring.ParsedUrlQuery) => querystring.ParsedUrlQuery;
type modifyFQParam = (a: FilterQuery) => FilterQuery;

export class TablePage extends React.Component<Props, State> {

    state: State = {
        selected: [],
        loading: false,
    };

    static defaultProps = {
        addButton: true,
        select: false,
        headerText: "Untitled Page",
        addText: "Add New",
        deleteText: "Delete",
        contentCount: 1000,
    };

    UNSAFE_componentWillReceiveProps(nextProps: any, nextContext: any) {
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
            .then(() => {
                this.setState({
                    loading: false
                })
            })
    }

    loadContents = (props: any) => {
        let qs = querystring.parse(props.location.search.substr(1));
        let sortBy = qs['sort_by'] as string;
        let sortDir = qs['sort_dir'] as string;
        let fqStr = qs['fq'] as string;
        let page = 1;
        let pageSize = 10;
        if (!!qs['page']) {
            page = Number(qs['page']) || 1;
        }

        if (!!qs['page_size']) {
            pageSize = Number(qs['page_size']) || 10;
        }

        return this.props.loadContents(page, pageSize, sortBy, sortDir, fqStr);
    };

    componentDidMount() {
        return this.loadContents(this.props).then(() => {
            this.setState({
                loading: false
            })
        })
    }

    /**
     *
     * @param dataField
     * @param sortDir
     */
    handleSort = (dataField: string, sortDir: string) => {
        this.modifyQS((qs: querystring.ParsedUrlQuery) => {
            qs['sort_by'] = dataField;
            qs['sort_dir'] = sortDir;
            return qs;
        });
    };


    /**
     *
     * @param current
     * @param pageSize
     */
    handlePage = (current: number, pageSize: number) => {
        this.modifyQS((qs: querystring.ParsedUrlQuery) => {
            qs['page'] = ""+current;
            qs['page_size'] = ""+pageSize;
            return qs;
        });
    };

    /**
     *
     * @param fn
     */
    modifyQS = (fn: modifyQSParam) => {
        let {
            location,
            match,
            history
        } = this.props;

        let qs: querystring.ParsedUrlQuery = querystring.parse(location.search.substr(1));
        qs = fn(qs);
        let newLink = match.url + "?" + querystring.stringify(qs);
        history.push(newLink);
    };

    onApplyFilters = (filters: FilterQuery.Filter[]): (Promise<any> | undefined) => {
        filters.map(f => {
            this.applyFilter(f);
        });
        return;
    };

    /**
     *
     * @param f
     */
    applyFilter = (f: FilterQuery.Filter) => {
        this.modifyFQ((fqObj: FilterQuery) => {
            fqObj.addFilter(f.key, f.op, f.val);
            return fqObj;
        });
    };

    /**
     *
     * @param dataField
     * @param value
     */
    onFilterChange = (dataField: string, value: any) => {
        let d: any = {};
        d[dataField] = value;


        // @ts-ignore
        this.setState((prevState: any) => {
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


    onDeleteFilter = (f: FilterQuery.Filter): (Promise<any> | undefined) => {
        this.modifyFQ((fqObj: FilterQuery) => {
            fqObj.removeFilter(f.key, f.op, f.val);
            return fqObj;
        });
        return;
    };

    /**
     *
     */
    popFilter = () => {
        this.modifyFQ((fqObj: FilterQuery) => {
            fqObj.pop();
            return fqObj;
        });
    };

    /**
     *
     * @param fn
     */
    modifyFQ(fn: modifyFQParam) {
        this.modifyQS((qs: querystring.ParsedUrlQuery) => {
            let faStr: string | string[] = qs['fq'];
            if (!faStr) {
                faStr = "";
            }
            let fqObj: FilterQuery = FilterQuery.fromString(faStr as string);
            fqObj = fn(fqObj);
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
        } = this.props;

        let {
            selected
        } = this.state;

        let qs: any = querystring.parse(location.search.substr(1));
        let sortBy = qs['sort_by'];
        let sortDir = qs['sort_dir'];
        let page = !!qs['page'] ? qs['page'] : 1;
        let filterObjects = FilterQuery.fromString(qs['fq']).getFilters();

        const rowSelection = {
            onChange: (selectedRowKeys: any, selectedRows: any) => {
                this.setState({
                    selected: selectedRows.map((s: any) => s._id)
                });
            },
            getCheckboxProps: (record: any) => ({
                name: "_ids",
                value: record._id,
            }),
        };

        data = data.map((d:any) => {
            d.key = d._id;
            return d;
        });

        function itemRender(current: any, type: any, originalElement: any) {
            if (type === 'prev') {
                return <a>Previous</a>;
            }
            if (type === 'next') {
                return <a>Next</a>;
            }
            return originalElement;
        }


        const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
            if (extra.action === 'sort') {
                this.handleSort(sorter.field, sorter.order);
            }

            if (extra.action === 'paginate') {
                this.handlePage(pagination.current, pagination.pageSize);
            }
        };

        let extra = [];

        if(!!selected.length) {
            extra.push(
                <Button key="delete" type="default" danger  onClick={this.handleDelete} >
                    {this.props.deleteText} {selected.length} items
                </Button>
            )
        }

        if (!!onClickAdd) {
            extra.push(<Button key="add" type="primary" onClick={onClickAdd} >{this.props.addText}</Button>)
        }

        const tableFilter = (
            <TableFilter onApplyFilters={this.onApplyFilters}
                         onDeleteFilter={this.onDeleteFilter}
                         columns={columns} />);

        const tableData = (
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
                onChange={onChange}
                loading={{
                    spinning: this.state.loading,
                    indicator: LoadingIcon,
                }}
                pagination={{
                    total:this.props.contentCount,
                    pageSize:10,
                    itemRender: itemRender
                }}
            />
        );

        let tableContent = (
            <Card>
                {tableFilter}
                <div style={{marginBottom:"8px"}}/>
                {tableData}
            </Card>
        );

        if(typeof this.props.renderContent === "function") {
            tableContent = this.props.renderContent(tableFilter, tableData)
        }

        return (
            <>
                <Row>
                    <Col span={24}>
                        <PageHeader
                            // onBack={() => window.history.back()}
                            title={this.props.headerText}
                            subTitle={`Found ${this.props.contentCount} entries`}
                            extra={extra}
                        >
                            {tableContent}
                        </PageHeader>
                    </Col>
                </Row>

            </>
        );
    }
}

export default withRouter(TablePage);