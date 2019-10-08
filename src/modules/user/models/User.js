const mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
});

UserSchema.statics.getUsers = function() {
    return this.find({}, ['_id', 'name', 'email']);
};

UserSchema.statics.getUserByEmail = function(email) {
    return this.findOne({email});
};

/**
 *
 * @param firstName
 * @param lastName
 * @param email
 * @param password
 * @return {Promise}
 */
UserSchema.statics.createUser = function(firstName, lastName, email, password) {
    let newUser = new this.User({
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password
    });

    return newUser.save();
};

/**
 *
 * @param userId
 * @return {Promise}
 */
UserSchema.statics.deleteUser = function(userId) {
    return this.find({ _id:userId }).remove();
};


/**
 *
 * @param userId
 * @param payload
 * @return {Promise}
 */
UserSchema.statics.updateUser = function(userId, payload) {
    return this.updateOne({ _id: userId }, payload);
};

module.exports = UserSchema;