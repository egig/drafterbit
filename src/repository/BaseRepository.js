export default class BaseRespository {

    constructor(conn, app) {
    	this.conn = conn;
    	this.app = app;
    }
}