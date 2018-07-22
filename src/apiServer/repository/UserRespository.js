const mysql  = require('mysql');
const BaseRespository = require('./BaseRepository');

class UserRespository extends BaseRespository {

    getUsers() {
        return new Promise((resolve, reject) => {

            this.connection.connect();

            this.connection.query('SELECT id,email,first_name,last_name from users', function (error, results, fields) {
                if (error) return reject(error);
                return resolve(results);
            });

            this.connection.end();

        });
    }

    getUserByEmail(email) {
        return new Promise((resolve, reject) => {

            this.connection.connect();

            this.connection.query('SELECT * FROM users where email=?',
                [email],
                function (error, results, fields) {
                    if (error) return reject(error);
                    return resolve(results);
                });

            this.connection.end();

        });
    }

    /**
	 *
	 * @param firstName
	 * @param lastName
	 * @param email
	 * @param password
	 * @return {Promise}
	 */
    createUser(firstName, lastName, email, password) {
        return new Promise((resolve, reject) => {

            this.connection.connect();

            this.connection.query('INSERT users(first_name, last_name, email, password) VALUES(?,?,?,?)',
                [firstName, lastName, email, password],
                (error, results, fields) => {
                    if (error) return reject(error);
                    this.connection.end();
                    return resolve(results);
                });
        });
    }

    /**
	 *
	 * @param userId
	 * @return {Promise}
	 */
    deleteUser(userId) {
        return new Promise((resolve, reject) => {

            this.connection.connect();

            this.connection.query('DELETE FROM users WHERE id=?',
                [userId],
                (error, results, fields) => {
                    if (error) return reject(error);
                    return resolve(results);
                });

            this.connection.end();

        });
    }

    /**
	 *
	 * @param userId
	 * @param firstName
	 * @param lastName
	 * @param email
	 * @return {Promise}
	 */
    updateUser(userId, firstName, lastName, email) {
        return new Promise((resolve, reject) => {

            console.log(userId);

            this.connection.connect();

            this.connection.query('UPDATE users SET first_name=?,last_name=?,email=? WHERE id=?',
                [firstName,lastName,email,userId],
                (error, results, fields) => {
                    if (error) return reject(error);
                    return resolve(results);
                });

            this.connection.end();

        });
    }
}

module.exports = UserRespository;