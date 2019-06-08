import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators } from 'redux';
import actions from '../actions';
import Layout from '../../common/components/Layout';
import Field from './Field';
import Notify from '../../../components/Notify';
import Card from '../../../components/Card/Card';
import { Row, Col } from 'reactstrap';

// TODO create blank content instead and save as draft
class ContentNew extends React.Component {

    constructor(props) {
        super(props);
        this.formData = {};
        this.state = {
            successText: ''
        };
    }

    onSubmit(form) {
        this.props.createContent(this.props.ctFields._id, Object.values(this.formData))
            .then(r => {
                this.setState({
                    successText: 'Content successfully saved'
                });
            });
    }

    componentDidMount() {
        let slug  = this.props.match.params.content_type_slug;
        this.props.getContentTypeFields(slug);
    }

    render() {
        return (
            <Layout>
                <Row>
                    <Col md="8">
                        <Card headerText="Add Content" >
                            <form onSubmit={e => {
                                e.preventDefault();
                                this.onSubmit(e.target);
                            }} >
                                {this.props.ctFields.fields.map((f,i) => {

                                    // TinyMCE
                                    if(f.type_id =='3') {
                                        return <Field onChange={(e) => {
                                            this.formData[f.name] = {
                                                label: f.label,
                                                type_id: f.type_id,
                                                name: f.name,
                                                value: e.target.getContent(),
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
                    </Col>
                </Row>
                {this.state.successText && <Notify type="success" message={this.state.successText} />}
            </Layout>);
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

export default connect(mapStateToProps, mapDispatchToProps)(ContentNew);