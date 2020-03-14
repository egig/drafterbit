import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import './Notify.css';

class Notify extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: [props.message]
        };

        this.c = null;
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            messages: [nextProps.message]
        });
    }

    componentDidMount() {
        this.c = setTimeout(()=> {
            this.props.onTimeout();

            this.setState({
                messages: []
            });

            window.clearTimeout(this.c);
        }, 3000);
    }

    componentDidUpdate() {
        this.c = setTimeout(()=> {
            this.props.onTimeout();
            
            this.setState({
                messages: []
            });

            window.clearTimeout(this.c);
        }, 3000);
    }

    render() {

        return (
            <ReactCSSTransitionGroup
                transitionName={{
                    enter: 'notifyEnter',
                    enterActive: 'notifyEnterActive',
                    leave: 'notifyLeave',
                    leaveActive: 'notifyLeaveActive',
                    appear: 'notifyAppear',
                    appearActive: 'notifyAppearActive'
                }}
                transitionAppear={true}
                transitionAppearTimeout={400}
                transitionEnterTimeout={400}
                transitionLeaveTimeout={200}>
                {this.state.messages.map((m,i) => {
                    return (
                        <div key={i} className="notifyWrapper">
                            <div className={`alert alert-${this.props.type} alertComponent`}>
                                <button onClick={e => {
                                    this.setState({
                                        messages: []
                                    });
                                    window.clearTimeout(this.c);
                                }} type="button" className="close" data-dismiss="alert">&times;</button>
                                <p>{m}</p>
                            </div>
                        </div>
                    );
                })}
            </ReactCSSTransitionGroup>
        );
    }
}

Notify.defaultProps = {
    isActive: false,
    onTimeout: function () {}
};

export default Notify;