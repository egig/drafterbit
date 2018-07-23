const mysql  = require('mysql');
const BaseRespository = require('./BaseRepository');
import mongoose from 'mongoose';
import userSchema from '../../schema/userSchema'


class UserRespository extends BaseRespository {

    getUsers() {
        return new Promise((resolve, reject) => {

        	// TODO dont create model each time
	        const User = mongoose.model('User', userSchema);
	        User.find({}, function(err, users) {
		        if (err) return reject(err);
		        return resolve(users);
	        });
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

	        newUser.save(function (err, user) {
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

	        const User = mongoose.model('User', userSchema);
	        User.find({ _id:userId }).remove((err, results) => {
		        if (err) return reject(err);
		        return resolve(results);
	        });
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

	        const User = mongoose.model('User', userSchema);

	        User.update({ _id: userId }, { $set:{
		        first_name: firstName,
		        last_name: lastName,
		        email: email
	        }
	        }, (err) => {
		        if (err) return reject(err);
		        return resolve(true);
	        });

        });
    }
}

module.exports = UserRespository;