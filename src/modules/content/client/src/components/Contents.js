import React  from 'react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators } from 'redux';
import actions from '../actions';
import TablePage from '../../../../core/client/src/components/TablePage';
import withDrafterbit from '../../../../core/client/src/withDrafterbit';
import ApiClient from '../ApiClient';

const FieldType = require('../../../../../FieldType');

class Contents extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            contentType: {
                name: ""
            },
	        contents: [],
	        contentCount:0,
	        sortBy: "",
	        sortDir: 'asc',
	        filterObject: {},
            ctFields: []
        };
    }

    loadContents = (match, page, sortBy, sortDir, fqStr) => {

        let ctSlug = match.params.content_type_slug;
        let client = new ApiClient(this.props.drafterbit.getAxiosInstance());
        return client.getContentType(ctSlug)
		    .then(contentType => {

		        this.setState({
                    contentType: contentType,
                    ctFields: contentType.fields
                });

                return client.getEntries(contentType.slug, page, sortBy, sortDir, fqStr)
			    .then(response => {

			        let contentCount = response.headers['content-range'].split("/")[1];
			    	this.setState({
					    contentCount: contentCount,
					    contents: response.data
				    })
			    });
		    });
    };

    handleDelete = (selected) => {
        let slug = this.props.match.params["content_type_slug"];
        let client = new ApiClient(this.props.drafterbit.getAxiosInstance())
        let deleteActionPromise = selected.map(entryId => {
            return client.deleteEntry(slug, entryId);
        });

        return Promise.all(deleteActionPromise)
            .then(() => {
               window.location.reload();
            })
    };

    onClickAdd = (e) => {
        // create draft
        let slug = this.props.match.params["content_type_slug"]
        let client = new ApiClient(this.props.drafterbit.getAxiosInstance());
        client.createDraft(slug)
            .then(d => {
                this.props.history.push(`/contents/${slug}/${d.item._id}`);
            })
            .catch(e => {
                console.error(e)
            })
    };

    canBeDisplayed(field) {
        return ([
            FieldType.RELATION_TO_MANY,
            FieldType.RELATION_TO_ONE,
            FieldType.RICH_TEXT,
            FieldType.UNSTRUCTURED
        ].indexOf(field.type_id) === -1) && field.show_in_list
    }

    render() {

        let slug = this.props.match.params.content_type_slug;

        const columns = [{
            dataField: '_id',
            text: '#ID',
            formatter: (cell, row) => {
                return <span><Link to={`/contents/${slug}/${row._id}`}>{cell.substr(0,3)}&hellip;</Link></span>;
            },
	        width: "80px"
        }];

        this.state.ctFields.map(f => {
        	// Don't display some column type by default
            if(this.canBeDisplayed(f)) {
		        columns.push({
			        dataField: f.name,
			        text: f.label,
			        sort: true
		        })
	        }
        });

        return (
            <TablePage
                headerText={this.state.contentType.name}
                data={ this.state.contents }
                contentCount={this.state.contentCount}
                columns={ columns }
                select={true}
                loadContents={this.loadContents}
                handleDelete={this.handleDelete}
                onClickAdd={this.onClickAdd}
            />
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


export default connect(mapStateToProps, mapDispatchToProps)(withDrafterbit(Contents));