import React from 'react';

class Card extends React.Component {

	render() {
		return (
			<div className="card">
				{this.props.headerText &&
					<h5 className="card-header">{this.props.headerText}</h5>
				}
				<div className="card-body">
					{this.props.children}
				</div>
			</div>
		)
	}
}

export default Card;