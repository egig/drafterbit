import React from 'react';
import withDrafterbit from '@drafterbit/common/client-side/withDrafterbit';
import {Row, Col, Card} from 'antd'

import './AuthCard.css';

class AuthCard extends React.Component {

    render() {

        let state = this.props.drafterbit.store.getState();
        let appName = state.COMMON.settings.General.app_name;

        return (
            <div className="h-100 my-login-page">
                <div className="h-100">
                    <div className="row justify-content-md-center h-100">
                        <div className="auth_card-cardWrapper">
                            <div className={'brand auth_card-brandContainer'}>
                                {/*<img className="auth_card-brandImg" src="/img/dtlogo3-black.png" />*/}
                                <h1 className="auth_card-brandImg">{appName}</h1>
                            </div>
                            <Card title={this.props.title}>
                                {this.props.children}
                            </Card>
                            <div className="auth_card-loginFooter">
                                Copyright &copy; {this.props.drafterbit.getConfig("appName")}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withDrafterbit(AuthCard);