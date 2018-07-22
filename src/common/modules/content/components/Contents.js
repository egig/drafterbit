import React from 'react';
import ContentManagerLayout from './Manager/ContentManagerLayout';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators } from 'redux';
import actions from '../actions';
import TableA from '../../../components/Table/TableA';
import Card from '../../../components/Card/Card';

class Contents extends React.Component {


    componentWillReceiveProps(nextProps) {
        if(nextProps.match.params.content_type_slug !== this.props.match.params.content_type_slug) {
            let projectId = nextProps.match.params.project_id;
            let ctSlug= nextProps.match.params.content_type_slug;
            this.props.getContentTypeFields(projectId,ctSlug)
                .then(r => {
                    return this.props.getContents(this.props.ctFields.id);
                });
        }
    }

    componentDidMount() {
        let projectId = this.props.match.params.project_id;
        let ctSlug= this.props.match.params.content_type_slug;
        this.props.getContentTypeFields(projectId,ctSlug)
            .then(r => {
                return this.props.getContents(this.props.ctFields.id);
            });
    }

    render() {
        const data = this.props.contents.map(c => {
            let content = JSON.parse(c.content_values);
            content.id = c.id;
            return content;
        });

        const columns = [{
            label: '#ID',
            accessor: 'id' // String-based value accessors!
        }
        ];

        // this.props.ctFields.fields.map(f => {
        // 	columns.push({
        // 		Header: f.label,
        // 		accessor: f.name
        // 	})
        // });

        this.props.ctFields.fields.map(f => {
            columns.push({
                label: f.label,
                accessor: f.name
            });
        });

        let projectId = this.props.match.params.project_id;
        let slug = this.props.match.params.content_type_slug;
        let addUrl = `/project/${projectId}/contents/${slug}/new`;

        return (
            <ContentManagerLayout>
                <Card headerText="Contents">
                    <Link className="btn btn-success mb-3" to={addUrl} >Add</Link>
                    <TableA data={data} columns={columns} />
                </Card>
            </ContentManagerLayout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        ctFields: state.content.ctFields,
        contents: state.content.contents
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(Contents);