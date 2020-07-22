import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

export = function translate(namespaces: string[]): any {

    function getDisplayName(WrappedComponent: any) {
        return WrappedComponent.displayName || WrappedComponent.name || 'Component';
    }

    return function wrap(WrappedComponent: any) {
        if (typeof WrappedComponent !== 'function') {
            throw new Error('Expected WrappedComponent to be a React component.');
        }

        class Translate extends React.Component {

            static contextTypes = {
                languageContext: PropTypes.object.isRequired
            };

            constructor(props: any, context: any) {
                super(props, context);
                this.state = {
                    loadedAt: new Date()
                }
            }

            // Try to use displayName of wrapped component
            static displayName = `Translate(${getDisplayName(WrappedComponent)})`;

            UNSAFE_componentWillMount() {
                // Get namespace for server side rendering
                this.context.languageContext.namespaces = this.context.languageContext.namespaces.concat(namespaces);
            }

            componentDidMount() {

                let lng = this.context.languageContext.i18n.language;
                let nsPromise = namespaces.filter((ns) => {
                    return !this.context.languageContext.i18n.hasResourceBundle(lng, ns);
                }).map((ns) => {
                    return axios.get(`/locales/${lng}/${ns}.json`)
                        .then(response => ({ns, resource: response.data}))
                });

                Promise.all(nsPromise).then(rList => {

                    rList.map(r => {
                        this.context.languageContext.i18n.addResourceBundle(lng, r.ns, r.resource);
                    });

                    this.setState({
                        loadedAt: new Date()
                    })
                })
            }

            render() {
                let newProps = {
                    t: (s: any) => this.context.languageContext.i18n.t(s)
                };

                return <WrappedComponent {...this.props} {...newProps}/>;
            }
        }

        return Translate;
    }
};