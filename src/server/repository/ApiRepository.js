import BaseRespository from './BaseRepository';
import ContentTypeRepository from './ContentTypeRepository';
import ContentRepository from './ContentRepository';

export default  class ApiKeyRespository extends BaseRespository {

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