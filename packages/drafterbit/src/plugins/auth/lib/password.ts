const bcrypt =  require('bcryptjs');

export = {
    /**
     *  Hash raw password.
     *
     * @param raw
     * @return {Promise}
     */
    hash: function (raw: string) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(raw, 5, (err: any, hashedPassword: string) => {
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
    compare: function (raw: string, hash: string) {
        return new Promise((resolve, reject)=> {
            bcrypt.compare(raw, hash, (err: any, doesMatch: boolean) => {
                if(err) return reject(err);
                return resolve(doesMatch);
            });
        });

    }
};