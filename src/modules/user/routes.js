const express = require('express');
const crypto = require( 'crypto');
const User = require('./models/User');
const password = require('../../lib/password');
const UserAuthError  = require('./UserAuthError');
const validateRequest = require('../../middlewares/validateRequest');
const { sendResetPasswordEmail } = require('../../lib/mail');
const createSession = require('../../createSession');

let router = express.Router();


function createSessionKey(token, user_id) {
    return `session-${user_id}-${token}`;
}

/**
 * @swagger
 * /users/is_login:
 *   get:
 *     description: Check user login state
 *     parameters:
 *       - in: query
 *         name: token
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: user_id
 *         type: integer
 *         schema:
 *           type: integer
 *         required: true
 *
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - /users/
 */
router.get('/users/is_login',
    validateRequest({
        user_id: {
            isInt: true,
            errorMessage: 'user_id must be integer'
        },
        token: {
            isString: true,
            errorMessage: 'token is required'
        },
    }),
    function (req, res) {
        (async function () {

            try {
                let result = await req.app.get('cache').get(createSessionKey(req.query.token, req.query.user_id));
                res.send(result);
            } catch (e ) {
                res.status(500);
                res.send(e.message);
            }

        })();
    });

/**
 * @swagger
 * /users/session:
 *   post:
 *     consumes:
 *       - application/json
 *     description: Create user session
 *     parameters:
 *       - in: body
 *         name: payload
 *         required:
 *           - name
 *           - password
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - /users/
 */
router.post('/users/session',
    validateRequest({
        email: {
            isString: true,
            errorMessage: 'email is requiredr'
        },
        password: {
            isString: true,
            errorMessage: 'passwprd is required'
        }
    }),
    function (req, res) {

        (async function () {

            try {
                let email = req.body.email;
                let rawPassword = req.body.password;

                let m = User(req.app.get('db'));
                let user = await m.getUserByEmail(email);

                if(!user) {
                    throw new UserAuthError('Wrong email or password');
                }

                let isMatch  = await password.compare(rawPassword, user.password);

                if(!isMatch) {
                    throw new UserAuthError('Wrong email or password');
                }

                let token = crypto.randomBytes(32).toString('hex');

                let authUser = {
                    id: user.id,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    token: token
                };

                let cache = req.app.get('cache');
                let key = createSessionKey(token, user.id);
                await cache.delWithPattern(`*session-${user.id}-*`);
                await cache.set(key, JSON.stringify(authUser), {
                    ttl: 28800
                });

                res.send(authUser);

            } catch (e ) {
                res.status(500);

                if(e instanceof UserAuthError) {
                    res.status(401);
                }

                res.send(e.message);
            }

        })();
    });

/**
 * @swagger
 * /users:
 *   get:
 *     description: Get list of users
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - /users/
 */
router.get('/users', function (req, res) {

    (async function () {

        try {
            let m = req.app.model('@user/User');
            let results = await m.getUsers();
            res.send(results);
        } catch (e) {
            res.status(500);
            res.send(e.message);
        }

    })();

});

/**
 * @swagger
 * /users:
 *   post:
 *     consumes:
 *       - application/json
 *     description: Create user
 *     parameters:
 *       - in: body
 *         name: payload
 *         schema:
 *           type: object
 *           required:
 *             - first_name
 *             - last_name
 *             - email
 *             - password
 *           properties:
 *             first_name:
 *               type: string
 *             last_name:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - /users/
 */
router.post('/users',
    validateRequest({
        first_name: {
            isString: true,
            errorMessage: 'first_name is required'
        },
        last_name: {
            isString: true,
            errorMessage: 'last_name is required'
        },
        email: {
            isString: true,
            errorMessage: 'email is required'
        },
        password: {
            isString: true,
            errorMessage: 'password is required'
        },
    }),
    function (req, res) {
        (async function () {

            try {
                let hashedPassword = await password.hash(req.body.password);

                let m = req.app.model('@user/User');
                // TODO validation
                await m.createUser(
                    req.body.first_name,
                    req.body.last_name,
                    req.body.email,
                    hashedPassword,
                );

                res.send({message: 'OK'});

            } catch (e) {
                res.status(500);
                res.send(e.message);
            }

        })();

    });

/**
 * @swagger
 * /users/:user_id:
 *   delete:
 *     description: Delete user
 *     parameters:
 *       - in: path
 *         name: user_id
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - /users/
 */
router.delete('/users/:user_id',
    validateRequest({
        user_id: {
            notEmpty: true,
            errorMessage: 'user_id must be integer'
        },
    }),
    (req, res) => {

        (async function () {

            try {

                let m = req.app.model('@user/User');
                await m.deleteUser(req.params.user_id);
                res.send({message: 'OK'});

            } catch (e ) {
                res.status(500);
                res.send(e.message);
            }

        })();

    });

/**
 * @swagger
 * /users/{user_id}:
 *   patch:
 *     consumes:
 *       - application/json
 *     description: Update user
 *     parameters:
 *       - in: path
 *         name: user_id
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *       - in: body
 *         name: payload
 *         schema:
 *           type: object
 *           properties:
 *             first_name:
 *               type: string
 *             last_name:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - /users/
 */
router.patch('/users/:user_id',
    validateRequest({
        user_id: {
            notEmpty: true,
            errorMessage: 'user_id must be integer'
        },
        first_name: {
            optional: true,
            errorMessage: 'first_name is required'
        },
        last_name: {
            optional: true,
            errorMessage: 'last_name is required'
        },
        email: {
            optional: true,
            errorMessage: 'email is required'
        }
    }),
    (req, res) => {

        (async function () {

            try {
                let m = req.app.model('@user/User');
                // TODO validation
                await m.updateUser(req.params.user_id, req.body);
                res.send({message: 'OK'});

            } catch (e ) {
                res.status(500);
                res.send(e.message);
            }

        })();
    });


/**
 * @swagger
 * /users/reset_password:
 *   post:
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     description: Update Password
 *     parameters:
 *       - in: formData
 *         name: email
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - /users/
 */
router.post('/users/reset_password',
    validateRequest({
        email: {
            isString: true,
            errorMessage: 'first_name is required'
        }
    }),
    function (req, res) {
        (async function () {

            try {
                let response = await sendResetPasswordEmail(req.body.email);
                res.send(response);

            } catch (e) {
                req.app.get('log').error(e);
                res.status(500);
                res.send(e.message);
            }

        })();

    });

router.post('/login', function (req, res) {

    (async function () {

        try {

            let user = await createSession(req.app, req.body.email, req.body.password);
            req.session.user = user;
            res.send(user);

        } catch (e) {
            res.status(e.status || 500);
            res.send({
                message: e.message
            });
        }

    })();

});


router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports =  router;