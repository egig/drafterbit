import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../actions';
import Layout from '../../common/components/Layout';
import Field from './Field';
import Notify from '../../../components/Notify';
import Card from '../../../components/Card/Card';
import { Row, Col } from 'reactstrap';

class ContentEdit extends React.Component {

    constructor(props) {
        super(props);
        this.formData = {};
        this.state = {
            successText: '',
            formData: {}
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
        let params = this.props.match.params;
        let contentId = params.content_id;
        let slug = params.content_type_slug;
        this.props.getCTFieldsAndGetContent(slug, contentId);
    }

    componentDidUpdate(prevProps) {
        if(this.props.content !== prevProps.content) {
            console.log('updating content');
            this.props.content.fields.map(f => {
                this.formData[f.name] = f;
                this.setState({
                    formData: this.formData
                });

            });
        }
    }

    render() {
        return (
            <Layout>
	            <Row>
		            <Col md="8">
			            <Card headerText="Edit Content" >
				            <form onSubmit={e => {
                                e.preventDefault();
                                this.onSubmit(e.target);
                            }} >
					            {this.props.contentTypeFields.map((f,i) => {


						            let value = this.formData[f.name] ? this.formData[f.name].value : '';

						            // CKEditor
						            if(f.type_id =='3') {
							            return <Field value={value} onChange={(e) => {

                                            this.formData[f.name] = {
                                                label: f.label,
                                                type_id: f.type_id,
                                                name: f.name,
                                                value: e.target.getContent()
                                            };

                                        }} key={i} field={f} />;
						            }

						            return <Field value={value} onChange={e => {

                                        let value = e.target.value;
                                        this.setState(oldState => {

                                            let formData = oldState.formData;
                                            formData[f.name] = {
                                                label: f.label,
                                                type_id: f.type_id,
                                                name: f.name,
                                                value
                                            };
                                            return Object.assign({}, oldState, {
                                                formData
                                            });

                                        });


                                    }} key={i} field={f} />;
					            })}

					            <div className="form-group">
						            <button type="submit" className="btn btn-success">Save</button>
					            </div>
				            </form>
			            </Card>
		            </Col>
	            </Row>
	            {this.state.successText && <Notify type="success" message={this.state.successText} />}
            </Layout>);
    }
}

const mapStateToProps = (state) => {
    return {
        content: state.CONTENT.content,
        contentTypeFields: state.CONTENT.ctFields.fields
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ContentEdit);