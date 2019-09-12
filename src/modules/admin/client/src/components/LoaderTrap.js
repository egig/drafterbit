import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import './LoaderTrap.css';

class LoaderTrap extends React.Component {
    render() {

        return (
            <ReactCSSTransitionGroup
                transitionName={{
                    enter: 'loaderEnter',
                    enterActive: 'loaderEnterActive',
                    leave: 'loaderLeave',
                    leaveActive: 'loaderLeaveActive',
                    appear: 'loaderAppear',
                    appearActive: 'loaderAppearActive'
                }}
                transitionAppear={true}
                transitionAppearTimeout={200}
                transitionEnter={false}
                transitionLeaveTimeout={200}>
                <div className="loaderTrap">
                    <div className="loaderImgContainer">
                        <img src="/assets/img/ajax-loader.svg" />
                    </div>
                </div>
            </ReactCSSTransitionGroup>
        );
    }
}

LoaderTrap.defaultProps = {
    isActive: false
};

export default LoaderTrap;