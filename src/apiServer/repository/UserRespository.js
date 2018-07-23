const mysql  = require('mysql');
const BaseRespository = require('./BaseRepository');
import mongoose from 'mongoose';
import userSchema from '../../schema/userSchema'



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

	        const User = mongoose.model('User', userSchema);
	        let newUser = new User({
		        first_name: firstName,
		        last_name: lastName,
		        email: email,
		        password: password
	        });

	        newUser.save(function (err, fluffy) {
		        if (err) return reject(err);
		        resolve(true)
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