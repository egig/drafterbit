import React, { Component } from 'react';
import ExecutionEnvironment from 'exenv';
import shallowEqual from 'shallowequal';
import PropTypes from 'prop-types';

module.exports = function translate(namespaces) {

	function getDisplayName(WrappedComponent) {
		return WrappedComponent.displayName || WrappedComponent.name || 'Component';
	}

	return function wrap(WrappedComponent) {
		if (typeof WrappedComponent !== 'function') {
			throw new Error('Expected WrappedComponent to be a React component.');
		}

		let mountedInstances = [];

		function emitChange(languageContext) {
			languageContext.namespaces = languageContext.namespaces.concat(namespaces);
		}

		class Translate extends Component {
			// Try to use displayName of wrapped component
			static displayName = `Translate(${getDisplayName(WrappedComponent)})`;

			// Expose canUseDOM so tests can monkeypatch it
			static canUseDOM = ExecutionEnvironment.canUseDOM;

			shouldComponentUpdate(nextProps) {
				return !shallowEqual(this.props, nextProps);
			}

			componentWillMount() {
				mountedInstances.push(this);
				emitChange(this.context.languageContext);
				this.context.languageContext.i18n.loadNamespaces(namespaces);
			}

			componentDidUpdate() {
				emitChange(this.context.languageContext);
			}

			componentWillUnmount() {
				const index = mountedInstances.indexOf(this);
				mountedInstances.splice(index, 1);
				emitChange(this.context.languageContext);
			}

			render() {
				let newProps = {
					t: (s) => this.context.languageContext.i18n.t(s)
				}

				return <WrappedComponent {...this.props} {...newProps}/>;
			}
		}

		Translate.contextTypes = {
			languageContext: PropTypes.object.isRequired
		};

		return Translate;
	}
};