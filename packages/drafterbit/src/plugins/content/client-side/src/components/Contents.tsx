import React  from 'react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators } from 'redux';
import actions from '../actions';
// @ts-ignore
import TablePage from '@drafterbit/common/dist/client-side/components/TablePage';
// @ts-ignore
import withDrafterbit from '@drafterbit/common/dist/client-side/withDrafterbit';
import ClientSide from "../../../../admin/client-side/src/ClientSide";
import FieldType from '@drafterbit/common/dist/FieldType';

type State = {
    type: {
        name:string
    },
    contents: any[],
    contentCount: number,
    sortBy: string,
    sortDir: string,
    filterObject: any,
    ctFields: []
}

type Props = {
    $dt: ClientSide,
    match: any,
    history: any
}

class Contents extends React.Component<Props, State> {

    state: State = {
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

    constructor(props: any) {
        super(props);
    }

    loadContents = (match: any, page: number, sortBy: string, sortDir: string, fqStr: string) => {

        let typeName = match.params.type_name;
        // @ts-ignore
        let client = this.props.$dt.getApiClient();
        return client.getType(typeName)
		    .then((type: any) => {

		        this.setState({
                    type: type,
                    ctFields: type.fields
                });

                return client.getEntries(type.name, page, sortBy, sortDir, fqStr)
			    .then((response: any) => {

			        let contentCount = response.headers['content-range'].split("/")[1];
			    	this.setState({
					    contentCount: contentCount,
					    contents: response.data
				    })
			    });
		    });
    };

    handleDelete = (selected: any) => {
        let slug = this.props.match.params["type_name"];
        let client = this.props.$dt.getApiClient();
        let deleteActionPromise = selected.map((entryId: string) => {
            return client.deleteEntry(slug, entryId);
        });

        return Promise.all(deleteActionPromise)
            .then(() => {
               window.location.reload();
            })
    };

    onClickAdd = (e: Event) => {
        // create draft
        let slug = this.props.match.params["type_name"];
        let client = this.props.$dt.getApiClient();
        client.createDraft(slug)
            .then((d: any) => {
                this.props.history.push(`/c/${slug}/${d.item._id}`);
            })
            .catch((e: any) => {
                console.error(e)
            })
    };

    canBeDisplayed(field: any) {
        return (FieldType.primitives().indexOf(field.type_name) !== -1) && field.show_in_list
    }

    render() {

        let slug = this.props.match.params.type_name;

        const columns = [{
            dataIndex: '_id',
            title: '#ID',
            render: (text: string, row: any) => {
                return <span><Link to={`/c/${slug}/${row._id}`}>{text.substr(0,3)}&hellip;</Link></span>;
            },
	        width: "80px"
        }];

        this.state.ctFields.map((f: any) => {
        	// Don't display some column type by default
            if(this.canBeDisplayed(f)) {
		        columns.push({
			        dataIndex: f.name,
			        title: f.label,
                    sorter: true
		        } as any)
	        }
        });

        return (
            <TablePage
                headerText={this.state.type.name}
                data={ this.state.contents }
                contentCount={this.state.contentCount}
                columns={ columns }
                loadContents={this.loadContents}
                handleDelete={this.handleDelete}
                onClickAdd={this.onClickAdd}
            />
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
        ctFields: state.CONTENT.ctFields,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators(actions, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(withDrafterbit(Contents));