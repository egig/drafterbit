import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import actions from '../actions';
import Style from './Login.style';
import AuthCard from './AuthCard';
import withStyle from '../../../withStyle';
import { Helmet } from 'react-helmet';
import translate from '../../../translate';
import Notify from '../../../components/Notify';

class ResetPassword extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            errorText: ''
        };
    }

    render() {

        let classes = this.props.classNames;
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
                        <input type="password" name="new_password" className={`form-control ${classes.formControlBorder}`} id="email" aria-describedby="emailHelp"/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className={classes.labelWidth}>Confirm New Password</label>
                        <input id="password" type="password" className={`form-control ${classes.formControlBorder}`} name="password" required data-eye />
                    </div>

                    <div className={`form-group no-margin ${classes.noMargin}`}>
                        <button type="submit" className={`btn btn-success btn-block ${classes.btnPadding}`}>
                            Save
                        </button>
                    </div>
                </form>
            </AuthCard>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.USER.currentUser
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};

export default translate(['reset_password'])(withStyle(Style)(
    connect(mapStateToProps, mapDispatchToProps)(ResetPassword)
));