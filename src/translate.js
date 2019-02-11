// @flow

const React = require('react');
import PropTypes from 'prop-types';
import axios from 'axios';

module.exports = function translate(namespaces: Array<string>) {

	function getDisplayName(WrappedComponent) {
		return WrappedComponent.displayName || WrappedComponent.name || 'Component';
	}

	return function wrap(WrappedComponent: Object) {
		if (typeof WrappedComponent !== 'function') {
			throw new Error('Expected WrappedComponent to be a React component.');
		}

		type Props = {};
		type State = {
			loadedAt:any
		};

		class Translate extends React.Component<Props, State> {

			constructor(props: Object, context: Object) {
				super(props, context);
				this.state = {
					loadedAt: new Date()
				}
			}

			// Try to use displayName of wrapped component
			static displayName = `Translate(${getDisplayName(WrappedComponent)})`;

			componentWillMount() {
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