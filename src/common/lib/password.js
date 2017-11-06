import bcrypt from 'bcrypt';

export default {
    hash: function (raw, cb) {
        // cb(err, bcrptedPass)
        bcrypt.hash(raw, 5, cb);
    },

    compare: function (raw, hash, cb) {
        // cb(err, doesMatch)
        bcrypt.compare(raw, hash, cb);
    }
};