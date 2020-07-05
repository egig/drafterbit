import React  from 'react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators } from 'redux';
import actions from '../actions';
import TablePage from '@drafterbit/common/client-side/components/TablePage';
import withDrafterbit from '@drafterbit/common/client-side/withDrafterbit';

const FieldType = require('@drafterbit/common/FieldType');

class Contents extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            type: {
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

        let typeName = match.params.type_name;
        let client = this.props.$dt.getApiClient();
        return client.getType(typeName)
		    .then(type => {

		        this.setState({
                    type: type,
                    ctFields: type.fields
                });

                return client.getEntries(type.name, page, sortBy, sortDir, fqStr)
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
        let slug = this.props.match.params["type_name"];
        let client = this.props.$dt.getApiClient();
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
        let slug = this.props.match.params["type_name"];
        let client = this.props.$dt.getApiClient();
        client.createDraft(slug)
            .then(d => {
                this.props.history.push(`/contents/${slug}/${d.item._id}`);
            })
            .catch(e => {
                console.error(e)
            })
    };

    canBeDisplayed(field) {
        return (FieldType.primitives().indexOf(field.type_name) !== -1) && field.show_in_list
    }

    render() {

        let slug = this.props.match.params.type_name;

        const columns = [{
            dataIndex: '_id',
            title: '#ID',
            render: (text, row) => {
                return <span><Link to={`/contents/${slug}/${row._id}`}>{text.substr(0,3)}&hellip;</Link></span>;
            },
	        width: "80px"
        }];

        this.state.ctFields.map(f => {
        	// Don't display some column type by default
            if(this.canBeDisplayed(f)) {
		        columns.push({
			        dataField: f.name,
			        dataIndex: f.name,
			        text: f.display_text,
			        title: f.display_text,
                    sorter: true
		        })
	        }
        });

        return (
            <TablePage
                headerText={this.state.type.name}
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