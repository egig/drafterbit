const { create } = require('jss');
const crypto = require('crypto');
const version = require('./package.json').version
const nested = require('jss-nested').default;

const jss = create({
	generateClassName: (rule, sheet) => {

		return `${rule.name || 'jss'}-`+crypto.createHash('md5').update(version).digest("hex").substr(0, 7);
	},
	plugins: [nested()]
});

module.exports = jss;

