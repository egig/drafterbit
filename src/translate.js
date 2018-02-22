import React, { Component } from 'react';
import ExecutionEnvironment from 'exenv';
import shallowEqual from 'shallowequal';
import PropTypes from 'prop-types';
import axios from 'axios';

module.exports = function translate(namespaces) {

	function getDisplayName(WrappedComponent) {
		return WrappedComponent.displayName || WrappedComponent.name || 'Component';
	}

	return function wrap(WrappedComponent) {
		if (typeof WrappedComponent !== 'function') {
			throw new Error('Expected WrappedComponent to be a React component.');
		}

		class Translate extends Component {

			constructor(props, context) {
				super(props, context);
				this.state = {
					loadedAt: new Date()
				}
			}

			// Try to use displayName of wrapped component
			static displayName = `Translate(${getDisplayName(WrappedComponent)})`;

			componentWillMount() {
				this.context.languageContext.namespaces = this.context.languageContext.namespaces.concat(namespaces);
			}

			componentDidMount() {

				let lng = this.context.languageContext.i18n.languages[0];
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
					t: (s) => this.context.languageContext.i18n.t(s)
				};

				return <WrappedComponent {...this.props} {...newProps}/>;
			}
		}

		Translate.contextTypes = {
			languageContext: PropTypes.object.isRequired
		};

		return Translate;
	}
};