import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import './Modal.css';

class Modal extends React.Component {
    render() {
        return (
            <ReactCSSTransitionGroup
                transitionName={{
                    enter: 'modalEnter',
                    enterActive: 'modalEnterActive',
                    leave: 'modalLeave',
                    leaveActive: 'modalLeaveActive',
                    appear: 'modalAppear',
                    appearActive: 'modalAppearActive'
                }}
                transitionAppear={true}
                transitionAppearTimeout={200}
                transitionEnter={false}
                transitionLeaveTimeout={200}>
                <div className='modalTrap'>
                    <div className='dialogContainer'>
                        {this.props.children}
                    </div>
                </div>
            </ReactCSSTransitionGroup>
        );
    }
}

Modal.defaultProps = {
    isActive: false
};

export default Modal;