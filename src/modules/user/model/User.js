import mongoose from 'mongoose';

let UserSchema = mongoose.Schema({
	first_name: String,
	last_name: String,
	email: String,
	password: String,
});


UserSchema.statics.getUsers = function() {
	return new Promise((resolve, reject) => {
		this.find({}, ['_id', 'name', 'email'], function(err, users) {
			if (err) return reject(err);
			return resolve(users);
		});
	});
}

UserSchema.statics.getUserByEmail = function(email) {
	return new Promise((resolve, reject) => {

		this.findOne({email}, function(err, user) {
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
UserSchema.statics.createUser = function(firstName, lastName, email, password) {
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
UserSchema.statics.deleteUser = function(userId) {
	return new Promise((resolve, reject) => {
		this.find({ _id:userId }).remove((err, results) => {
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
UserSchema.statics.updateUser = function(userId, payload) {
	return new Promise((resolve, reject) => {

		this.updateOne({ _id: userId }, payload, (err) => {
			if (err) return reject(err);
			return resolve(true);
		});

	});
}

module.exports = function (connection) {
	return connection.model('User', UserSchema);
};