import UserAuthError from './UserAuthError';
import App from "../../Application";
const password = require('./lib/password');
const crypto = require('crypto');

function createSessionKey(token: string, user_id: string) {
    return `session-${user_id}-${token}`;
}

module.exports = function createSession(app: App, email: string, rawPassword: string) {

    let m = app.model('@user/User');
    return m.getUserByEmail(email)
        .then((user: any) => {

            if(!user) {
                return Promise.reject(new UserAuthError('Wrong email or password'));
            }

            return password.compare(rawPassword, user.password)
                .then((isMatch: boolean) => {

                    if(!isMatch) {
                        return Promise.reject(new UserAuthError('Wrong email or password'));
                    }

                    let token = crypto.randomBytes(32).toString('hex');

                    let authUser = {
                        id: user.id,
                        email: user.email,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        token: token
                    };

                    let cache = app.get('cache');
                    let key = createSessionKey(token, user.id);

                    return Promise.all([
                        cache.delWithPattern(`*session-${user.id}-*`),
                        cache.set(key, JSON.stringify(authUser), {
                            ttl: 28800
                        })
                    ])
                        .then(() => {
                            return authUser;
                        });
                });

        });
};