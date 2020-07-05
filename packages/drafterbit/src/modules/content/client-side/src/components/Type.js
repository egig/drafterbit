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
        this.fetchType = this.fetchType.bind(this);
    }

    fetchType() {
        let client = this.props.$dt.getApiClient();
        return client.getType(this.props.match.params.type_name)
            .then(type => {

                this.setState({
                    _id: type._id,
                    name: type.name,
                    slug: type.slug,
                    display_text: type.display_text,
                    description: type.description,
                    has_fields: type.has_fields,
                    fields: type.fields,
                    loading: false
                });
            });
    }

    componentDidMount() {
        this.fetchType()
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

    deleteType(deleteForm) {
        // TODO create alert
        let client = this.props.$dt.getApiClient();
        client.deleteType(deleteForm.id.value)
            .then(r => {
                // TODO create success notif
                this.props.history.push('/types');
            });
    }

    doUpdate() {
        let client = this.props.$dt.getApiClient();
        client.updateType(
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
                                                               this.fetchType().then(() => {
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
                                                       this.fetchType().then(() => {
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
                                this.deleteType(e.target);
                            }}>
                                <input type="hidden" name="id" id="id" value={this.state._id}/>
                                <Button type="line" htmlType="submit" danger>Delete Type</Button>
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
        types: state.CONTENT.types
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(withDrafterbit(Type));