import BaseRepository from '../../../repository/BaseRepository';
import userSchema from '../schema/userSchema';

export default class UserRepository extends BaseRepository {

	constructor(conn, app) {
		super(app);
		this.User = this.conn.model('User', userSchema);
	}

    getUsers() {
        return new Promise((resolve, reject) => {

            this.User.find({}, ['_id', 'name', 'email'], function(err, users) {
                if (err) return reject(err);
                return resolve(users);
            });
        });
    }

    getUserByEmail(email) {
        return new Promise((resolve, reject) => {

            this.User.findOne({email}, function(err, user) {
                if (err) return reject(err);
                return resolve(user);
            });
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

            let newUser = new this.User({
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: password
            });

            newUser.save(function (err) {
                if (err) return reject(err);
                resolve(true);
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

            User.find({ _id:userId }).remove((err, results) => {
                if (err) return reject(err);
                return resolve(results);
            });
        });
    }


    /**
     *
     * @param userId
     * @param payload
     * @return {Promise}
     */
    updateUser(userId, payload) {
        return new Promise((resolve, reject) => {

            this.User.updateOne({ _id: userId }, payload, (err) => {
                if (err) return reject(err);
                return resolve(true);
            });

        });
    }
}