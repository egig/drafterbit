import React, {Fragment} from 'react';
import actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, ModalBody, FormGroup, Label, Input } from 'reactstrap';
import Card from 'drafterbit-module-admin/client/src/components/Card/Card';
import _ from 'lodash';
import withDrafterbit from 'drafterbit-module-admin/client/src/withDrafterbit';

class ContentTypeForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: props.isOpen,
            contentTypeId: null,
            name: "",
            slug: "",
            description: ""
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.contentTypeId != this.props.contentTypeId) {
            this.setState({
                contentTypeId: nextProps.contentTypeId,
                name: nextProps.name,
                slug: nextProps.slug,
                description: nextProps.description
            })
        }
    }

    onSubmit(form) {
        let { contentTypeId, name, slug, description } = this.state
        let client = this.props.drafterbit.getApiClient();
    
        (() => {
            if(!!contentTypeId) {
                return client.updateContentType(contentTypeId, name, slug, description)
                    .then(() => {
                        return {
                            _id: contentTypeId,
                            name,
                            slug,
                            description
                        }
                    })
             } else {
                return client.createContentType(name, slug,description)
             }
        })()
        .then(contentType => {
            this.props.onSuccess(contentType);
        });
    }

    render() {

        return (
            <Modal isOpen={this.props.isOpen}>
                <Card headerText="New Content Type" >
                    <form onSubmit={e => {
                        e.preventDefault();
                        this.onSubmit(e.target);
                    }}>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" className="form-control" name="name" value={this.state.name}
                            onChange={e => {
                                this.setState({
                                    name: e.target.value
                                })
                            }}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="slug">Slug</label>
                            <input type="text" className="form-control" name="slug" value={this.state.slug}
                            onChange={e => {
                                this.setState({
                                    slug: e.target.value
                                })
                            }}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea className="form-control" name="description"
                            onChange={e => {
                                this.setState({
                                    description: e.target.value                                    
                                })
                            }}
                            value={this.state.description}
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-success">Save</button>
                            <button type="button" onClick={e => {
                                e.preventDefault();
                                this.props.onCancel(e)
                            }} className="btn btn-default">Cancel</button>
                        </div>
                    </form>
                </Card>
            </Modal>
        );
    }
}

ContentTypeForm.defaultProps = {
    isOpen: false,
    contentTypeId: null,
    name: "",
    slug: "",
    description: "",
    onCancel: () => {},
    onSuccess: () => {}
}

const mapStateToProps = (state) => {
    return {
	    contentType: state.CONTENT_TYPE.contentType,
	    contentTypes: state.CONTENT_TYPE.contentTypes,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
            setAjaxLoading: actions.setAjaxLoading
        }, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withDrafterbit(ContentTypeForm));