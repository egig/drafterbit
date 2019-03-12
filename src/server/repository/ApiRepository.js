const BaseRespository = require('./BaseRepository');
const ContentTypeRepository = require('./ContentTypeRepository');
const ContentRepository = require('./ContentRepository');
const model = require('../model');

class ApiKeyRespository extends BaseRespository {

	constructor() {
		super();

		this.contentTypeRespository = new ContentTypeRepository();
		this.contentRespository = new ContentRepository();
	}

	getContents(slug) {
		return this.contentTypeRespository.getContentType(slug)
			.then(contentType => {
				return this.contentRespository.getContents(contentType.id);
			});
	}
}

module.exports = ApiKeyRespository;