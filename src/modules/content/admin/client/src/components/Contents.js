import React  from 'react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators } from 'redux';
import actions from '../actions';
import TablePage from 'drafterbit-module-admin/client/src/components/TablePage';
import withDrafterbit from 'drafterbit-module-admin/client/src/withDrafterbit';

class Contents extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
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
	    this.props.drafterbit.getApiClient().getContentType(ctSlug)
		    .then(contentType => {

		        this.setState({
                    ctFields: contentType.fields
                });

                this.props.drafterbit.getApiClient().getEntries(contentType.slug, page, sortBy, sortDir, fqStr)
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
        let client = this.props.drafterbit.getApiClient();
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
        this.props.drafterbit.getApiClient().createDraft(slug)
            .then(d => {
                this.props.history.push(`/contents/${slug}/${d.item._id}`);
            })
            .catch(e => {
                console.error(e)
            })
    };

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

        const {
            FIELD_RELATION_TO_MANY,
            FIELD_RELATION_TO_ONE,
            FIELD_RICH_TEXT,
            FIELD_UNSTRUCTURED
        } = window.__DT_CONST;
        this.state.ctFields.map(f => {
        	// Don't display some column type by default
            if([
                FIELD_RELATION_TO_MANY,
                FIELD_RELATION_TO_ONE,
                FIELD_RICH_TEXT,
                FIELD_UNSTRUCTURED
                ].indexOf(f.type_id) === -1) {
		        columns.push({
			        dataField: f.name,
			        text: f.label,
			        sort: true
		        })
	        }
        });

        return (
            <TablePage
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