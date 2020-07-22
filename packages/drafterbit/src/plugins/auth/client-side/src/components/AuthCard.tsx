import React from 'react';
// @ts-ignore
import withDrafterbit from '@drafterbit/common/dist/client-side/withDrafterbit';
import {Card} from 'antd'

import './AuthCard.css';
import ClientSide from "../../../../admin/client-side/src/ClientSide";


type Props = {
    $dt: ClientSide,
    title: string
}

class AuthCard extends React.Component<Props, {}> {

    render() {

        let state = this.props.$dt.store.getState();
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
                                Copyright &copy; {this.props.$dt.getConfig("appName")}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withDrafterbit(AuthCard);