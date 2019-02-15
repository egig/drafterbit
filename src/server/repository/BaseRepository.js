const mongoose = require('mongoose');

class BaseRespository {

    constructor(app) {
	    // mongoose.connect(app.get('config').get('MONGODB_URL'));
    }
}

module.exports = BaseRespository;