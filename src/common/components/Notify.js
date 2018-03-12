import React from 'react';
import withStyle from '../withStyle';
import Style from './Notify.style'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Notify extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			messages: props.messages
		};

		this.c = null;
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			messages: nextProps.messages
		})
	}

	componentDidMount() {
		this.c = setTimeout(()=> {
			this.setState({
				messages: []
			});

			window.clearTimeout(this.c);
		}, 3000);
	}

	componentDidUpdate() {
		this.c = setTimeout(()=> {
			this.setState({
				messages: []
			});

			window.clearTimeout(this.c);
		}, 3000);
	}

	render() {

		let { classNames } = this.props;
		return (
			<ReactCSSTransitionGroup
				transitionName={{
		    enter: classNames.notifyEnter,
		    enterActive: classNames.notifyEnterActive,
		    leave: classNames.notifyLeave,
		    leaveActive: classNames.notifyLeaveActive,
		    appear: classNames.notifyAppear,
		    appearActive: classNames.notifyAppearActive
		  }}
				transitionAppear={true}
				transitionAppearTimeout={400}
				transitionEnterTimeout={400}
				transitionLeaveTimeout={200}>
				{this.state.messages.map((m,i) => {
					return (
						<div key={i} className={classNames.notifyWrapper}>
							<div className="alert alert-success">
								{m}
							</div>
						</div>
					)
				})}
			</ReactCSSTransitionGroup>
		)
	}
}

Notify.defaultProps = {
	isActive: false
}

export default withStyle(Style)(Notify);