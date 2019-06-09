import querystring from 'querystring';
import React from 'react';
import Layout from '../../common/components/Layout';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators } from 'redux';
import actions from '../actions';
import Card from '../../../components/Card/Card';
import DataTable from '../../../components/DataTable';
import apiClient from '../../../apiClient';
import _ from 'lodash';
import { parseFilterQuery, stringifyFilterQuery } from '../../../../../../common/parseFilterQuery'

class Contents extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          selected: [],
          contents: [],
          contentCount:0,
          sortBy: "",
          sortDir: 'asc',
          filterObject: {}
        };

        this.handleOnSelect = this.handleOnSelect.bind(this);
        this.handleOnSelectAll = this.handleOnSelectAll.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentWillReceiveProps(nextProps) {

        let qs = querystring.parse(this.props.location.search.substr(1));
        let nextQs = querystring.parse(nextProps.location.search.substr(1));

        let isPathSame = (nextProps.match.params.content_type_slug == this.props.match.params.content_type_slug);

        if(isPathSame && _.isEqual(qs, nextQs)) {
          return;
        }

        let ctSlug= nextProps.match.params.content_type_slug;
        let sortBy = nextQs['sort_by'];
        let sortDir = nextQs['sort_dir'];
        let fqStr = nextQs['fq'];
        this.loadContents(ctSlug, nextQs['page'], sortBy, sortDir, fqStr);

        let fqObj  = parseFilterQuery(fqStr);

        this.setState((prevState) => {
          return {
            filterObject: isPathSame ? fqObj : {}
          }
        });
    }

    loadContents(ctSlug, page, sortBy, sortDir, fqSr) {
      let client = apiClient.createClient({});

	    this.props.getContentTypeFields(ctSlug)
		    .then(r => {
			    client.getContents(ctSlug, page, sortBy, sortDir, fqSr)
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
        let sortBy = qs['sort_by'];
        let sortDir = qs['sort_dir'];
        this.loadContents(ctSlug, page, sortBy, sortDir);

        let fqObj  = parseFilterQuery(qs['fq']);

        this.setState((prevState) => {
          return {
            filterObject: Object.assign({}, prevState.filterObject, fqObj)
          }
        });
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
    }

    handleDelete(e) {
        this.props.deleteContents(this.state.selected)
    }

    render() {

        let slug = this.props.match.params.content_type_slug;
        let addUrl = `/contents/${slug}/new`;
        let qs = querystring.parse(this.props.location.search.substr(1));
        let sortBy = qs['sort_by'];
        let sortDir = qs['sort_dir'];
        let page = !!qs['page'] ? qs['page'] : 1;

        const data = this.state.contents;

        const columns = [{
            dataField: '_id',
            text: '#ID',
            formatter: (cell, row) => {
	            return <Link to={`/contents/${slug}/${cell}`}>{cell.substr(0,3)}&hellip;</Link>;
            },
          width: "80px"
        }];

        this.props.ctFields.fields.map(f => {
          // Don't display Rich Text by default
          if(f.type_id !== 3) {
            columns.push({
              dataField: f.name,
              text: f.label,
              sort: true
            })
          }
        });

        return (
            <Layout>
                <Card headerText="Contents">
                    <Link className="btn btn-success mb-3" to={addUrl} >Add</Link>
                    {!!this.state.selected.length &&
                      <button className="btn btn-danger ml-2 mb-3" onClick={this.handleDelete} >Delete</button>
                    }
                    <DataTable
                        idField="_id"
                        data={ data }
                        columns={ columns }
                        select={{
                          selected:this.state.selected,
                          onSelect:this.handleOnSelect,
                          onSelectAll:this.handleOnSelectAll
                        }}
                        sortBy={sortBy}
                        sortDir={sortDir}
                        onSort={(dataField, sortDir) => {
                          let qs = querystring.parse(this.props.location.search.substr(1));
                          let newSortDir = (sortDir == 'desc') ? 'asc' : 'desc';
                          qs['sort_by'] = dataField;
                          qs['sort_dir'] = newSortDir;
                          let newLink = this.props.match.url + "?" + querystring.stringify(qs);
                          this.props.history.push(newLink);
                        }}
                        onApplyFilter={(filterObj) => {

                          let qs = querystring.parse(this.props.location.search.substr(1));
                          qs['fq'] = stringifyFilterQuery(filterObj);
                          let newLink = this.props.match.url + "?" + querystring.stringify(qs);
                          this.props.history.push(newLink);

                        }}
                        onFilterChange={(dataField, value) => {
                            let d = {};
                            d[dataField] = value;

                            this.setState((prevState) => {
                              return {
                                filterObject: Object.assign({}, prevState.filterObject, d)
                              }
                            })
                        }}
                        onReset={() => {
                          let qs = querystring.parse(this.props.location.search.substr(1));
                          delete qs['fq'];
                          let newLink = this.props.match.url + "?" + querystring.stringify(qs);
                          this.props.history.push(newLink);
                        }}
                        filterObject={this.state.filterObject}
                        currentPage={page}
                        totalPageCount={Math.ceil(this.state.contentCount/10)}
                        renderPaginationLink={(p) => (
                          <Link className="page-link" to={this.props.match.url+"?page="+p}>{p}</Link>
                        )}
                        onRowClick={(col) => {
                          let newLink = `/contents/${slug}/${col['_id']}`;
                          this.props.history.push(newLink);
                        }}
                    />
                </Card>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
    	ctFields: state.CONTENT.ctFields
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(Contents);