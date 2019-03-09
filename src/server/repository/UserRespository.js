const BaseRespository = require('./BaseRepository');
const mongoose = require('mongoose');
const userSchema = require('../schema/userSchema');


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

            const User = mongoose.model('User', userSchema);
            User.findOne({email}, function(err, user) {
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

            const User = mongoose.model('User', userSchema);
            let newUser = new User({
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
     * @param payload
     * @return {Promise}
     */
    updateUser(userId, payload) {
        return new Promise((resolve, reject) => {

            const User = mongoose.model('User', userSchema);

            User.updateOne({ _id: userId }, payload, (err) => {
                if (err) return reject(err);
                return resolve(true);
            });

        });
    }
}

module.exports = UserRespository;