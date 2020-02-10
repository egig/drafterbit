import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import _ from 'lodash';
import withDrafterbit from '../../../../core/client/src/withDrafterbit';
import { TabContent, TabPane, Nav, NavItem, NavLink,
    Modal, ModalBody, ModalFooter, Row, Col,
    FormGroup, Input, Label} from 'reactstrap';

// TODO ugly required path
const FieldType = require('../../../../../FieldType');
const { slugify } = require("../../../../../utils");
const ApiClient = require('../ApiClient')

class FieldForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            fieldId: null,
            type_id: 0,
            label: "",
            name: "",
            related_content_type_slug: "",
            activeTab: '1',
            validation_rules: []
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.toggle = this.toggle.bind(this);
        this.loadContentType = this.loadContentType.bind(this);
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    onSubmit(e) {
        e.preventDefault();
        let client = new ApiClient(this.props.drafterbit.getAxiosInstance());
        (() => {
            if(!!this.props.fieldId) {
                return client.updateContentTypeField(
                    this.props.contentTypeId,
                    this.props.fieldId,
                    this.state.label,
                    this.state.name,
                    this.state.related_content_type_slug,
                    this.state.validation_rules.join("|")
                )
            } else {
                // create
                return client.addContentTypeField(
                    this.props.contentTypeId,
                    this.state.label,
                    this.state.name,
                    this.state.type_id,
                    this.state.related_content_type_slug,
                    this.state.validation_rules.join("|")
                )
            }
            
        })()
            .then(this.props.onSuccess);
    }

    componentDidUpdate(prevProps, prevState) {
        if (!!this.props.fieldId && (prevProps.fieldId !== this.props.fieldId)
        ) {
            this.loadContentType(this.props.contentTypeId)
        }
    }

    loadContentType(contentTypeId) {

        const {
            fieldId
        } = this.props;

        if(!!fieldId) {
            let client = new ApiClient(this.props.drafterbit.getAxiosInstance());
            client.getContentType(contentTypeId)
            .then(ct => {

                let f = ct.fields.filter(fi => fi._id == fieldId)[0];
                this.setState({
                    type_id: f.type_id,
                    label: f.label,
                    name: f.name,
                    validation_rules: !!f.validation_rules ?  f.validation_rules.split("|") :[]
                })
            });
        }
    }

    componentDidMount() {
        const {
            fieldId,
            contentTypeId,
        } = this.props;

        if(!!contentTypeId && !!fieldId) {
            this.loadContentType( this.props.contentTypeId)
        }
    }

    setValidationRuleToState(name, isChecked) {
        if(isChecked) {
            this.setState({
                validation_rules: this.state.validation_rules.concat([name])
            })
        } else {
            this.setState({
                validation_rules: this.state.validation_rules.filter(r => (r != name))
            })
        }
    }

    isChecked(name) {
        return this.state.validation_rules.indexOf(name) !== -1;
    }

    disabled() {
        return !!this.state.fieldId ? "disabled" : false;
    }

    render() {

        let field = FieldType.get(this.state.type_id);

        let validationOptions = !!field ? field.validationOptions : [];

        return (
            <Modal isOpen={this.props.isOpen} onClosed={e => {
                console.log("ONEXIT");
                this.setState({
                    fieldId: null,
                    type_id: 0,
                    label: "",
                    name: "",
                    related_content_type_slug: "",
                    activeTab: '1',
                    validation_rules: []
                })
            }} >
                <form onSubmit={this.onSubmit}>
                    <ModalBody>
                    <h4 style={{display: "inline-block"}}>Edit Field</h4>
                    <Nav tabs className="float-right">
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '1' })}
                                onClick={() => { this.toggle('1'); }}
                            >
                                Basic
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '2' })}
                                onClick={() => { this.toggle('2'); }}
                            >
                                Validation
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <div className="clearfix mb-3" />
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                            <Row>
                                <Col sm="12">
                                        <div className="form-group">
                                            <label htmlFor="type">Type</label>
                                            <select disabled={this.disabled()}
                                            className="form-control"
                                            id="type"
                                            onChange={e => {
                                                this.setState({
                                                    type_id: e.target.value
                                                })
                                            }} value={this.state.type_id}>
                                                <option value="">Select Field Type</option>
                                                {FieldType.fieldTypes.map((f,i) => {
                                                    return <option key={i} value={f.id}>{f.name}</option>;
                                                })}
                                            </select >
                                        </div>
                                        {!!_.includes([4,5], parseInt(this.state.type_id)) &&
                                        <div className="form-group">
                                            <select  disabled={this.disabled()} className="form-control"
                                                    name="related_content_type_slug"
                                                    id="related_content_type_slug"
                                                    value={this.state.related_content_type_slug}
                                                    onChange={e => {
                                                        this.setState({
                                                            related_content_type_slug: e.target.value
                                                        })
                                                    }} >
                                                {this.props.contentTypes.map((ct,i) => {
                                                    return <option key={i} value={ct.slug}>{ct.name}</option>;
                                                })}
                                            </select>
                                        </div>
                                        }
                                        <div className="form-group">
                                            <label htmlFor="label">Label</label>
                                            <input type="text" className="form-control" name="label"
                                                id="label" value={this.state.label}
                                                onChange={e => {
                                                    this.setState({
                                                        label: e.target.value,
                                                        name: slugify(e.target.value, "_")
                                                    })
                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="name">Name</label>
                                            <input  disabled={this.disabled()} type="text" className="form-control" name="name" id="name" value={this.state.name}
                                                   onChange={e => {
                                                       this.setState({
                                                           name: e.target.value,
                                                       })
                                                   }}
                                            />
                                        </div>
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="2">
                            <Row>
                                <Col sm="12">
                                    {validationOptions.map((vo, i) => {
                                        return (
                                            <div key={i}>
                                                {(vo === 'is_required') &&
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input name="validation_rules[required]" type="checkbox" 
                                                                checked={this.isChecked('required')}
                                                                onChange={e => {
                                                                    this.setValidationRuleToState('required', e.target.checked)
                                                                }}
                                                            />{' '}
                                                            This Field is Required
                                                        </Label>
                                                    </FormGroup>
                                                }
                                                {(vo === 'unique') &&
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input name="validation_rules[unique]" type="checkbox" 
                                                                checked={this.isChecked('unique')}
                                                                onChange={e => {
                                                                    this.setValidationRuleToState('unique', e.target.checked)
                                                                }}/>{' '}
                                                            This Field should be Unique
                                                        </Label>
                                                    </FormGroup>
                                                }
                                                {(vo === 'min') &&
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input type="checkbox" />{' '}
                                                            This Field Has Minimum Value
                                                        </Label>
                                                        <Input type="number" placeholder="Minimum Value"/>
                                                    </FormGroup>
                                                }

                                                {(vo === 'max') &&
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input type="checkbox" />{' '}
                                                            This Field Has Maximum Value
                                                        </Label>
                                                        <Input type="number" placeholder="Maximum Value"/>
                                                    </FormGroup>
                                                }
                                            </div>
                                        )
                                    })}
                                </Col>
                            </Row>
                        </TabPane>
                    </TabContent>
                    </ModalBody>
                    <ModalFooter>
                        <button type="submit" className="btn btn-success">Save Field</button>&nbsp;
                        <button onClick={this.props.onCancel} className="btn btn-light">Cancel</button>
                    </ModalFooter>
                </form>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        contentTypes: state.CONTENT.contentTypes
    };
};
export default connect(mapStateToProps)(withDrafterbit(FieldForm));