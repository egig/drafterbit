const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
});

module.exports = userSchema;