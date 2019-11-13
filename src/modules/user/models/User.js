const mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

UserSchema.statics.getUsers = function() {
    return this.find({}, ['_id', 'first_name', 'last_name', 'email']);
};

UserSchema.statics.getUserByEmail = function(email) {
    return this.findOne({email});
};

/**
 *
 * @param name
 * @param email
 * @param password
 * @returns {*}
 */
UserSchema.statics.createUser = function(name, email, password) {
    let newUser = new this({
        name: name,
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
    return this.find({ _id:userId }).deleteOne();
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