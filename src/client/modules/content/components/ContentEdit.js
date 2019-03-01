const React = require('react');
import {connect} from 'react-redux';
import {bindActionCreators } from 'redux';
import actions from '../actions';
import ProjectLayout from '../../project/components/ProjectLayout';
import Field from './Field';
import Notify from '../../../components/Notify';
import Card from '../../../components/Card/Card';

class ContentEdit extends React.Component {

    constructor(props) {
        super(props);
        this.formData = {};
        this.state = {
            successText: ''
        };
    }

    onSubmit(form) {
        this.props.updateContent(this.props.match.params.content_id, Object.values(this.formData))
            .then(r => {
                this.setState({
                    successText: 'Content successfully updated'
                });
            });
    }

    componentDidMount() {
    	  let contentId = this.props.match.params.content_id;
        this.props.getContent(contentId);
    }

    componentDidUpdate(prevProps) {
    	if(this.props.content !== prevProps.content) {
    		console.log("updating content");
		    this.props.content.fields.map(f => {
			    this.formData[f.name] = f;
		    });
	    }
    }


    render() {
        return (
            <ProjectLayout>
                <div className="col-6">
                    <Card headerText="Add Content" >
                        <form onSubmit={e => {
                            e.preventDefault();
                            this.onSubmit(e.target);
                        }} >
                            {this.props.content.fields.map((f,i) => {

                            	// CKEditor
                            	if(f.type_id =='3') {
		                            return <Field onChange={(e, editor) => {
                                    this.formData[f.name] = {
                                    	label: f.label,
                                    	type_id: f.type_id,
                                    	name: f.name,
                                    	value: editor.getData(),
                                    };
                                }} key={i} field={f} />;
	                            }

                              return <Field onChange={e => {
                                  this.formData[f.name] = {
                                    label: f.label,
                                    type_id: f.type_id,
                                    name: f.name,
                                    value: e.target.value,
                                  };
                              }} key={i} field={f} />;
                            })}

                            <div className="form-group">
                                <button type="submit" className="btn btn-success">Save</button>
                            </div>
                        </form>
                    </Card>
                </div>
                {this.state.successText && <Notify type="success" message={this.state.successText} />}
            </ProjectLayout>);
    }
}

const mapStateToProps = (state) => {
    return {
	    content: state.content.content
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ContentEdit);