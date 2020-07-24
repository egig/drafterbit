import React, { Fragment } from 'react';
import FieldForm from './FieldForm';
// @ts-ignore
import { withDrafterbit } from '@drafterbit/common';
import TypeForm from './TypeForm'

import {Row, Col, Tabs, Button, Card, message, PageHeader} from 'antd';
import ClientSide from "../../../../admin/client-side/src/ClientSide";

type Props = {
    $dt: ClientSide,
    history: any,
    match: any
}

type State = {
    _id: string,
    name: string,
    slug: string,
    display_text: string,
    description: string,
    has_fields: boolean,
    fields: any[],
    fieldDialogActive: boolean,
    editedFieldId: string,
    fieldTypeSelected: any,
    basicEditForm: boolean,
    loading: boolean,
    editedField: any,
    types: any[]
}

class Type extends React.Component<Props, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            _id: '',
            name: '',
            slug: '',
            display_text: '',
            description: '',
            has_fields: false,
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
            .then((type: any) => {

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
                    .then((response: any) => {
                        this.setState({
                            types: response.list
                        })
                    })
            })

    }

    deleteField(f: any) {
    	let newFields = this.state.fields.filter((sf) => {
		    return (sf._id !== f._id);
	    });

	    this.setState({
		    fields: newFields,
	    }, this.doUpdate);
    }

    deleteType(deleteForm: any) {
        // TODO create alert
        let client = this.props.$dt.getApiClient();
        client.deleteType(deleteForm.id.value)
            .then(()=> {
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
        ).then(() => {
            message.success("Content Type Saved Successfully !");
        });
    }

    render() {

        return (
            <>
                <PageHeader
                    // onBack={() => window.history.back()}
                    title={this.state.display_text}
                    subTitle={this.state.description}
                    extra={[<Button key="edit" type="default" onClick={e => {
                        e.preventDefault();
                        this.setState({
                            basicEditForm: true
                        })
                    }}><i className="icon-note"/> Edit </Button>]}
                >
                    {this.state.loading ||
                    <Row>
                        <Col span="12">
                            {this.state.has_fields &&
                            <Card title="Fields">
                                <Tabs type="card" tabPosition="left">
                                    {this.state.fields.map((f, i) => {
                                        return (
                                            <Tabs.TabPane tab={f.label} key={f.name}>
                                                <FieldForm field={f}
                                                           belongsToTypeName={this.state.name}
                                                           onSuccess={() => {
                                                               this.fetchType().then(() => {
                                                                   message.success("Content Type Saved Successfully !");
                                                               });
                                                           }}
                                                           types={this.state.types} />
                                                <Button danger type="default" onClick={e => {
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
                                    <Button type="default" htmlType="submit" danger>Delete Type</Button>
                                </form>
                            </Card>
                        </Col>
                    </Row>
                    }
                </PageHeader>
                {this.state.loading && <div>Loading&hellip;</div>}
                <TypeForm
                    visible={this.state.basicEditForm}
                    typeId={this.state._id}
                    name={this.state.name}
                    displayText={this.state.display_text}
                    slug={this.state.slug}
                    description={this.state.description}
                    has_fields={this.state.has_fields}
                    onCancel={(e: any) => {
                        this.setState({
                            basicEditForm: false
                        })
                    }}
                    onSuccess={(ct: any) => {
                        this.setState({
                            basicEditForm: false,
                        });

                        message.success("Content Type Saved Successfully !");
                    }}
                    />
            </>
        );
    }
}


export default withDrafterbit(Type)