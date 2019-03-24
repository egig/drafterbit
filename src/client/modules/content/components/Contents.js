import querystring from 'querystring';
import React from 'react';
import Layout from '../../common/components/Layout';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators } from 'redux';
import actions from '../actions';
import Card from '../../../components/Card/Card';
import Table from '../../../components/Table';
import apiClient from '../../../apiClient';

class Contents extends React.Component {

    constructor(props) {
        super(props);
        this.state = { selected: [], contents: [], contentCount:0 };
        this.handleOnSelect = this.handleOnSelect.bind(this);
        this.handleOnSelectAll = this.handleOnSelectAll.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentWillReceiveProps(nextProps) {

		    let qs = querystring.parse(this.props.location.search.substr(1));
		    let nextQs = querystring.parse(nextProps.location.search.substr(1));

		    let isPageSame = (qs['page'] == nextQs['page']);
		    let isPathSame = (nextProps.match.params.content_type_slug == this.props.match.params.content_type_slug);
		    if (isPageSame && isPathSame) {
		      return;
		    }

		    let ctSlug= nextProps.match.params.content_type_slug;
		    this.loadContents(ctSlug, nextQs['page']);
    }

    loadContents(ctSlug, page) {
    	let client = apiClient.createClient({});

	    this.props.getContentTypeFields(ctSlug)
		    .then(r => {
			    client.getContents(this.props.ctFields._id, page)
			    .then(response => {

			    	this.setState({
					    contentCount: response.headers['dt-data-count'],
					    contents: response.data
				    })
			    });
		    });
    }

    componentDidMount() {
        let ctSlug= this.props.match.params.content_type_slug;
        let qs = querystring.parse(this.props.location.search.substr(1));
        let page = !!qs['page'] ? qs['page'] : 1;
        this.loadContents(ctSlug, page);
    }

    handleOnSelect(row, isSelect) {
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
    }

    handleDelete(e) {
        this.props.deleteContents(this.state.selected)
    }

    render() {

        let slug = this.props.match.params.content_type_slug;
        let addUrl = `/contents/${slug}/new`;
		    let qs = querystring.parse(this.props.location.search.substr(1));
		    let page = !!qs['page'] ? qs['page'] : 1;

        const data = this.state.contents.map(c => {
            let item = {
                _id: c._id
            };

            c.fields.map(f => {
                item[f.name] = f.value;
            });

            return item;
        });

            const columns = [{
                dataField: '_id',
                text: '#ID',
                formatter: (cell, row) => {
                    return <Link to={`/contents/${slug}/${cell}`}>{cell}</Link>
                }
            }];

        this.props.ctFields.fields.map(f => {
            columns.push({
                dataField: f.name,
                text: f.label
            });
        });

        const selectRow = {
            mode: 'checkbox',
            clickToSelect: true,
            selected: this.state.selected,
            onSelect: this.handleOnSelect,
            onSelectAll: this.handleOnSelectAll
        };

        return (
            <Layout>
                <Card headerText="Contents">
                    <Link className="btn btn-success mb-3" to={addUrl} >Add</Link>
                    {!!this.state.selected.length &&
                      <button className="btn btn-danger ml-3" onClick={this.handleDelete} >Delete</button>
                    }
                    <Table
                        keyField='_id'
                        data={ data }
                        columns={ columns }
                        selectRow={selectRow}
                        currentPage='1'
                        totalPageCount={Math.ceil(this.state.contentCount/10)}
                    />
                </Card>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        ctFields: state.CONTENT.ctFields,
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(Contents);