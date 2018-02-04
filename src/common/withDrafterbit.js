import React from 'react';

const withDrafterbit = function withDrafterbit(WrappedComponent) {

	class DrafterbitHOC extends React.Component {
		render() {

			const newProps = {
				drafterbit: this.context.drafterbit,
			};

			return <WrappedComponent {...this.props} {...newProps} />;
		}
	}

	DrafterbitHOC.displayName = `withDrafterbit(${WrappedComponent.displayName || WrappedComponent.name})`,
		DrafterbitHOC.contextTypes = {
			drafterbit: React.PropTypes.object.isRequired,
		};

	return DrafterbitHOC;
};

module.exports = withDrafterbit;
