const bcrypt = require('bcryptjs');

module.exports = {
    /**
     *  Hash raw password.
     *
     * @param raw
     * @return {Promise}
     */
    hash: function (raw) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(raw, 5, (err, hashedPassword) => {
                if(err) return reject(err);
                return resolve(hashedPassword);
            });
        });
    },

    /**
     * Compare raw password and the hash.
     *
     * @param raw
     * @param hash
     * @return {Promise}
     */
    compare: function (raw, hash) {
        return new Promise((resolve, reject)=> {
            bcrypt.compare(raw, hash, (err, doesMatch) => {
                if(err) return reject(err);
                return resolve(doesMatch);
            });
        });

    }
};