const React = require('react');
import ProjectLayout from '../../project/components/ProjectLayout';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators } from 'redux';
import actions from '../actions';
import Card from '../../../components/Card/Card';
import BootstrapTable from 'react-bootstrap-table-next';

class Contents extends React.Component {

	constructor(props) {
		super(props);
		this.state = { selected: [] };
		this.handleOnSelect = this.handleOnSelect.bind(this);
		this.handleOnSelectAll = this.handleOnSelectAll.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
	}

	componentWillReceiveProps(nextProps) {
        if(nextProps.match.params.content_type_slug !== this.props.match.params.content_type_slug) {
            let projectId = nextProps.match.params.project_id;
            let ctSlug= nextProps.match.params.content_type_slug;
            this.props.getContentTypeFields(projectId,ctSlug)
                .then(r => {
                    return this.props.getContents(this.props.ctFields._id);
                });
        }
    }

    componentDidMount() {
        let projectId = this.props.match.params.project_id;
        let ctSlug= this.props.match.params.content_type_slug;
        this.props.getContentTypeFields(projectId, ctSlug)
            .then(r => {
                return this.props.getContents(this.props.ctFields._id);
            });
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
		console.log("deleteing", this.state.selected);
		this.props.deleteContents(this.state.selected)
	}

    render() {

	    let projectId = this.props.match.params.project_id;
	    let slug = this.props.match.params.content_type_slug;
	    let addUrl = `/project/${projectId}/contents/${slug}/new`;


        const data = this.props.contents.map(c => {
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
				    return <Link to={`/project/${projectId}/contents/${slug}/${cell}`}>{cell}</Link>
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
            <ProjectLayout>
                <Card headerText="Contents">
	                <Link className="btn btn-success mb-3" to={addUrl} >Add</Link>
	                {!!this.state.selected.length &&
	                  <button className="btn btn-danger ml-3" onClick={this.handleDelete} >Delete</button>
	                }
	                <BootstrapTable bootstrap4
	                                keyField='_id'
	                                data={ data }
	                                columns={ columns }
	                                selectRow={selectRow}
	                                striped
	                                hover
	                                condensed/>
                </Card>
            </ProjectLayout>
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