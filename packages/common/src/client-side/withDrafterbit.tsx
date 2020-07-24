import React from 'react';
import PropTypes from 'prop-types';

const withDrafterbit = function withDrafterbit(WrappedComponent: any): any {

    class DrafterbitHOC extends React.Component {

        static displayName = `withDrafterbit(${WrappedComponent.displayName || WrappedComponent.name})`;
        static contextTypes = {
            $dt: PropTypes.object.isRequired,
        };

        render() {
            const newProps = {
                $dt: this.context.$dt,
            };

            return <WrappedComponent {...this.props} {...newProps} />;
        }
    }

    return DrafterbitHOC;
};

export default withDrafterbit;
