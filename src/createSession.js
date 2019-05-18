import userRepository from './modules/user/repository/UserRespository';
import UserAuthError from './modules/user/UserAuthError';
import password from './lib/password';
import crypto from 'crypto';

function createSessionKey(token, user_id) {
    return `session-${user_id}-${token}`;
}

export default function createSession(app, email, rawPassword) {

    let r = new userRepository(app);
    return r.getUserByEmail(email)
        .then(user => {

            if(!user) {
                return Promise.reject(new UserAuthError('Wrong email or password'));
            }

            return password.compare(rawPassword, user.password)
                .then(isMatch => {

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

                    console.log(key);

                    return Promise.all([
                        cache.delWithPattern(`*session-${user.id}-*`),
                        cache.set(key, JSON.stringify(authUser), {
                            ttl: 28800
                        })
                    ])
                        .then(r => {
                            return authUser;
                        });
                });

        })
        .catch(e => {
            console.log(e);
        });
}