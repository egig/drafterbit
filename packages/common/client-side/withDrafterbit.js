import React from 'react';
import PropTypes from 'prop-types';

const withDrafterbit = function withDrafterbit(WrappedComponent) {

    class DrafterbitHOC extends React.Component {
        render() {

            const newProps = {
                $dt: this.context.$dt,
            };

            return <WrappedComponent {...this.props} {...newProps} />;
        }
    }

    DrafterbitHOC.displayName = `withDrafterbit(${WrappedComponent.displayName || WrappedComponent.name})`;
    DrafterbitHOC.contextTypes = {
        $dt: PropTypes.object.isRequired,
    };

    return DrafterbitHOC;
};

export default withDrafterbit;
