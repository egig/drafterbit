import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../actions';
import AuthCard from './AuthCard';
import { Helmet } from 'react-helmet';
import translate from '../../../translate';


class ResetPassword extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            errorText: ''
        };
    }

    render() {

        let t = this.props.t;

        return (
            <AuthCard title={t('reset_password:title')}>
                <Helmet>
                    <title>Reset Password - Drafterbit</title>
                </Helmet>

                {this.state.errorText &&
                <div className="alert alert-warning">
                    {this.state.errorText}
                </div>
                }

                <form onSubmit={(e) => {
                    e.preventDefault();
                    this.doLogin(e);
                }}>
                    <div className="form-group">
                        <label htmlFor="new_password">New Password</label>
                        <input type="password" name="new_password" className={'form-control login-formControlBorder'} id="email" aria-describedby="emailHelp"/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="login-labelWidth">Confirm New Password</label>
                        <input id="password" type="password" className={'form-control login-formControlBorder'} name="password" required data-eye />
                    </div>

                    <div className={'form-group login-noMargin'}>
                        <button type="submit" className={'btn btn-success btn-block login-btnPadding'}>
                            Save
                        </button>
                    </div>
                </form>
            </AuthCard>
        );
    }
}

ResetPassword.propType = {
    t: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
        currentUser: state.USER.currentUser
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};

export default translate(['reset_password'])(connect(mapStateToProps, mapDispatchToProps)(ResetPassword));