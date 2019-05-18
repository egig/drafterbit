import BaseRespository from '../../../repository/BaseRepository';
import Content from '../model/Content';
import ContentType from '../model/ContentType';

export default  class ApiKeyRespository extends BaseRespository {

    constructor(conn, app) {
        super(conn, app);

        this.content = Content(conn);
        this.contentType = new ContentType(conn);
    }

    getContents(slug) {
        return this.contentType.getContentType(slug)
            .then(contentType => {
                return this.content.getContents(contentType.id);
            });
    }
}