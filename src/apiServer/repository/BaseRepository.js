const mysql  = require('mysql');

class BaseRespository {

    constructor(app) {
        this.connection = mysql.createConnection({
            host     : app.get('config').get('MYSQL_HOST'),
            user     : app.get('config').get('MYSQL_USER'),
            password : app.get('config').get('MYSQL_PASSWORD'),
            database : app.get('config').get('MYSQL_DB')
        });
    }
}

module.exports = BaseRespository;