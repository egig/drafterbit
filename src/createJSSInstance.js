const { create } = require('jss');
const crypto = require('crypto');
const version = require('./../package.json').version
const nested = require('jss-nested').default;
const camelCase = require('jss-camel-case').default;

const createJSSInstance = function createJSSInstance() {
	return create({
		createGenerateClassName: () => {
			return (rule, sheet) => `${rule.key || 'jss'}-`+crypto.createHash('md5').update(version).digest("hex").substr(0, 7);
		},
		plugins: [nested(), camelCase()]
	});
}

export default createJSSInstance;

