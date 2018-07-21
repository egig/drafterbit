const Client = require('./Client');

const apiClient = {
	createClient: (options) => {
		return new Client(options);
	},
};

module.exports = apiClient;