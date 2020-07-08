const express = require('express');
const jwt = require('jsonwebtoken');
const password = require('./lib/password');
const UserAuthError  = require('./UserAuthError');
const validateRequest  = require('@drafterbit/common/middlewares/validateRequest');
const { sendResetPasswordEmail } = require('./lib/mail');
const fieldsToSchema = require( '@drafterbit/common/fieldsToSchema');
const Router = require('@koa/router');

let router = new Router();

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
// router.get('/users/is_login',
//     validateRequest({
//         user_id: {
//             isInt: true,
//             errorMessage: 'user_id must be integer'
//         },
//         token: {
//             isString: true,
//             errorMessage: 'token is required'
//         },
//     }),
//     function (req, res) {
//         (async function () {
//
//             try {
//                 let result = await req.app.get('cache').get(createSessionKey(req.query.token, req.query.user_id));
//                 res.send(result);
//             } catch (e ) {
//                 res.status(500);
//                 res.send(e.message);
//             }
//
//         })();
//     });

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
router.post('/token',
    validateRequest({
        email: {
            presence: true
        },
        password: {
            presence: true
        }
    }),
    async function (ctx, next) {

        try {
            let email = ctx.request.body.email;
            let rawPassword = ctx.request.body.password;

            let m = ctx.app.model('Type');

            let userCollectionName = 'User';
            let type = await  m.getType(userCollectionName);
            let schemaObj = fieldsToSchema.getSchema(type.fields);
            let userModel;
            try {
                userModel = ctx.app.getDB().model(userCollectionName);
            } catch (error) {
                userModel = ctx.app.getDB().model(userCollectionName, schemaObj);
            }

            let user = await userModel.findOne({
                email: email
            });

            //
            // let m = req.app.model('User');
            // let user = await m.getUserByEmail(email);
            //
            if(!user) {
                throw new UserAuthError('Wrong email or password');
            }

            let isMatch  = await password.compare(rawPassword, user.password);

            if(!isMatch) {
                throw new UserAuthError('Wrong email or password');
            }

            let token = jwt.sign({
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
            }, 'secretkey'); // TODO save this in config

            let authUser = {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                token: token
            };

            // let cache = req.app.get('cache');
            // let key = createSessionKey(token, user.id);
            // await cache.delWithPattern(`*session-${user.id}-*`);
            // await cache.set(key, JSON.stringify(authUser), {
            //     ttl: 28800
            // });

            ctx.body = authUser;

        } catch (e) {s
            if(e instanceof UserAuthError) {
                ctx.status =401;
            }

            ctx.throw(e)
        }

    }
    );

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
// router.get('/admin_users', function (req, res) {
//
//     (async function () {
//
//         try {
//             let m = req.app.model('User');
//             let results = await m.getUsers();
//             res.send(results);
//         } catch (e) {
//             res.status(500);
//             res.send(e.message);
//         }
//
//     })();
//
// });


/**
 * @swagger
 * /users/:user_id:
 *   get:
 *     description: Get a user
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
// router.get('/users/:user_id',
//     validateRequest({
//         user_id: {
//             notEmpty: true,
//             errorMessage: 'user_id must be integer'
//         },
//     }),
//     (req, res) => {
//
//         (async function () {
//
//             try {
//
//                 let m = req.app.model('User');
//                 let user = await m.findOne({_id: req.params.user_id});
//                 res.send(user);
//
//             } catch (e ) {
//                 res.status(500);
//                 res.send(e.message);
//             }
//
//         })();
//
//     });

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
// router.post('/users',
//     validateRequest({
//         name: {
//             isString: true,
//             errorMessage: 'first_name is required'
//         },
//         email: {
//             isString: true,
//             errorMessage: 'email is required'
//         },
//         password: {
//             isString: true,
//             errorMessage: 'password is required'
//         },
//     }),
//     function (req, res) {
//         (async function () {
//
//             try {
//                 let hashedPassword = await password.hash(req.body.password);
//
//                 let m = req.app.model('User');
//                 // TODO validation
//                 let newUser = await m.createUser(
//                     req.body.name,
//                     req.body.email,
//                     hashedPassword,
//                 );
//
//                 res.status(201).send(newUser);
//
//             } catch (e) {
//                 res.status(500);
//                 res.send(e.message);
//             }
//
//         })();
//
//     });

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
// router.delete('/users/:user_id',
//     validateRequest({
//         user_id: {
//             notEmpty: true,
//             errorMessage: 'user_id must be integer'
//         },
//     }),
//     (req, res) => {
//
//         (async function () {
//
//             try {
//
//                 let m = req.app.model('User');
//                 await m.deleteUser(req.params.user_id);
//                 res.send({message: 'OK'});
//
//             } catch (e ) {
//                 res.status(500);
//                 res.send(e.message);
//             }
//
//         })();
//
//     });

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
// router.patch('/users/:user_id',
//     validateRequest({
//         user_id: {
//             notEmpty: true,
//             errorMessage: 'user_id must be integer'
//         },
//         first_name: {
//             optional: true,
//             errorMessage: 'first_name is required'
//         },
//         last_name: {
//             optional: true,
//             errorMessage: 'last_name is required'
//         },
//         email: {
//             optional: true,
//             errorMessage: 'email is required'
//         }
//     }),
//     (req, res) => {
//
//         (async function () {
//
//             try {
//                 let m = req.app.model('User');
//                 // TODO validation
//                 await m.updateUser(req.params.user_id, req.body);
//                 res.send({message: 'OK'});
//
//             } catch (e ) {
//                 res.status(500);
//                 res.send(e.message);
//             }
//
//         })();
//     });


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
            presence: true
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

// router.post('/login', function (req, res) {
//
//     (async function () {
//
//         try {
//
//             let user = await createSession(req.app, req.body.email, req.body.password);
//             req.session.user = user;
//             res.send(user);
//
//         } catch (e) {
//             res.status(e.status || 500);
//             res.send({
//                 message: e.message
//             });
//         }
//
//     })();
//
// });


// router.get('/logout', (req, res) => {
//     req.session.destroy();
//     res.redirect('/');
// });

module.exports =  router.routes();