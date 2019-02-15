const React = require('react');
import withStyle from '../withStyle';
import Style from './LoaderTrap.style';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class LoaderTrap extends React.Component {
    render() {
        let { classNames } = this.props;
        return (
            <ReactCSSTransitionGroup
                transitionName={{
		    enter: classNames.loaderEnter,
		    enterActive: classNames.loaderEnterActive,
		    leave: classNames.loaderLeave,
		    leaveActive: classNames.loaderLeaveActive,
		    appear: classNames.loaderAppear,
		    appearActive: classNames.loaderAppearActive
		  }}
                transitionAppear={true}
                transitionAppearTimeout={200}
                transitionEnter={false}
                transitionLeaveTimeout={200}>
                <div className={classNames.loaderTrap}>
                    <div className={classNames.loaderImgContainer}>
                        <img src="/img/ajax-loader.svg" />
                    </div>
                </div>
            </ReactCSSTransitionGroup>
        );
    }
}

LoaderTrap.defaultProps = {
    isActive: false
};

export default withStyle(Style)(LoaderTrap);