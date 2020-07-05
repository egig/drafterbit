import React, { Fragment } from 'react';
import actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FieldForm from './FieldForm';
import withDrafterbit from '@drafterbit/common/client-side/withDrafterbit';
import TypeForm from './TypeForm'

import {Row, Col, Tabs, Button, Card, message} from 'antd';

class Type extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            _id: '',
            name: '',
            slug: '',
            display_text: '',
            description: '',
            fields: [],
	        fieldDialogActive: false,
	        editedFieldId: "",
            fieldTypeSelected: null,
            basicEditForm: false,
            loading: true,
            editedField: null,
            types: []
        };

        this.deleteField = this.deleteField.bind(this);
        this.doUpdate = this.doUpdate.bind(this);
        this.fetchContentType = this.fetchContentType.bind(this);
    }

    fetchContentType() {
        let client = this.props.$dt.getApiClient();
        return client.getContentType(this.props.match.params.content_type_id)
            .then(contentType => {

                this.setState({
                    _id: contentType._id,
                    name: contentType.name,
                    slug: contentType.slug,
                    display_text: contentType.display_text,
                    description: contentType.description,
                    has_fields: contentType.has_fields,
                    fields: contentType.fields,
                    loading: false
                });
            });
    }

    componentDidMount() {
        this.fetchContentType()
            .then(() => {
                let client = this.props.$dt.getApiClient();
                client.getTypes()
                    .then(types => {
                        this.setState({
                            types: types
                        })
                    })
            })

    }

    deleteField(f) {
    	let newFields = this.state.fields.filter((sf) => {
		    return (sf._id !== f._id);
	    });

	    this.setState({
		    fields: newFields,
	    }, this.doUpdate);
    }

    deleteContentType(deleteForm) {
        // TODO create alert
        let client = this.props.$dt.getApiClient();
        client.deleteContentType(deleteForm.id.value)
            .then(r => {
                // TODO create success notif
                this.props.history.push('/types');
            });
    }

    doUpdate() {
        let client = this.props.$dt.getApiClient();
        client.updateContentType(
            this.state._id,
            this.state.name,
            this.state.slug,
            this.state.description,
            this.state.fields
        ).then(r => {
            message.success("Content Type Saved Successfully !");
        });
    }

    render() {

        return (
            <Fragment>
                {this.state.loading && <div>Loading&hellip;</div>}
                {this.state.loading ||
                <Row>
                    <Col span="24">
                        <h2>{this.state.display_text} <small className="text-muted"><a href="/" onClick={e => {
                            e.preventDefault();
                            this.setState({
                                basicEditForm: true
                            })
                        }}><i className="icon-note"/></a></small></h2>
                        <small>{this.state.description}</small>
                        <div className="mb-3"/>
                    </Col>
                    <Col span="12">
                        {this.state.has_fields &&
                            <Card title="Fields">
                                <Tabs type="card" tabPosition="left">
                                    {this.state.fields.map((f, i) => {
                                        return (
                                            <Tabs.TabPane tab={f.display_text} key={f.name}>
                                                <FieldForm field={f}
                                                           belongsToTypeName={this.state.name}
                                                           onSuccess={() => {
                                                               this.fetchContentType().then(() => {
                                                                   message.success("Content Type Saved Successfully !");
                                                               });
                                                           }}
                                                           types={this.state.types} />
                                                <Button danger type="line" onClick={e => {
                                                    this.deleteField(f);
                                                }}>Delete</Button>
                                            </Tabs.TabPane>
                                        )
                                    })}
                                    <Tabs.TabPane tab="+ Add Field" key="_add_field">
                                        <FieldForm belongsToTypeName={this.state.name}
                                                   onSuccess={() => {
                                                       this.fetchContentType().then(() => {
                                                           message.success("Content Type Saved Successfully !");
                                                       });
                                                   }}
                                                   types={this.state.types} />
                                    </Tabs.TabPane>
                                </Tabs>
                            </Card>
                        }

                        <div className="mb-3"/>
                        <Card title={`Delete Type : ${this.state.name}`}>
                            <form onSubmit={e => {
                                e.preventDefault();
                                this.deleteContentType(e.target);
                            }}>
                                <input type="hidden" name="id" id="id" value={this.state._id}/>
                                <Button type="line" htmlType="submit" danger>Delete Content Type</Button>
                            </form>
                        </Card>
                    </Col>
                </Row>
                }
                <TypeForm
                    visible={this.state.basicEditForm}
                    typeId={this.state._id}
                    name={this.state.name}
                    displayText={this.state.display_text}
                    slug={this.state.slug}
                    description={this.state.description}
                    has_fields={this.state.has_fields}
                    onCancel={e => {
                        this.setState({
                            basicEditForm: false
                        })
                    }}
                    onSuccess={ct => {
                        this.setState({
                            basicEditForm: false,
                        });

                        message.success("Content Type Saved Successfully !");
                    }}
                    />
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        contentTypes: state.CONTENT.contentTypes
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(withDrafterbit(Type));