import React from 'react';
import PropTypes from 'prop-types';

const withStyle = function withStyle(style) {

    return function (WrappedComponent) {

        class StyleHOC extends React.Component {

            render() {
                const jss = this.context.jss;
                let { classes } = jss.createStyleSheet(style);

                const newProps = {
                    classNames: classes
                };

                return <WrappedComponent {...this.props} {...newProps} />;
            }
        }

        StyleHOC.displayName =  `withStyle(${WrappedComponent.displayName || WrappedComponent.name})`;
        StyleHOC.contextTypes = {
            jss: PropTypes.object.isRequired
        };

        return StyleHOC;
    };
};

module.exports = withStyle;
