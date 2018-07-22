const express = require('express');
let router = express.Router();
const password = require('../lib/password');
const config = require('../../config');
const userRepository = require('../repository/UserRespository');
const crypto = require('crypto');
const UserAuthError = require('../user/UserAuthError');
const validateRequest = require('../middlewares/validateRequest');
const { sendResetPasswordEmail } = require('../lib/mail');

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
 *        - User
 */
router.get('/users/is_login',
	validateRequest({
		user_id: {
			isInt: true,
			errorMessage: "user_id must be integer"
		},
		token: {
			isString: true,
			errorMessage: "token is required"
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
 *       - application/x-www-form-urlencoded
 *     description: Create user session
 *     parameters:
 *       - in: formData
 *         name: email
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *       - in: formData
 *         name: password
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
 *        - User
 */
router.post('/users/session',
	validateRequest({
		email: {
			isString: true,
			errorMessage: "email is requiredr"
		},
		password: {
			isString: true,
			errorMessage: "passwprd is required"
		}
	}),
	function (req, res) {

	(async function () {

		try {
			let email = req.body.email;
			let rawPassword = req.body.password;

			let r = new userRepository(req.app);
			let results = await r.getUserByEmail(email);

			if(!results.length) {
				throw new UserAuthError("Wrong email or password");
			}

			let user = results[0];
			let isMatch  = await password.compare(rawPassword, user.password);

			if(!isMatch) {
				throw new UserAuthError("Wrong email or password");
			}

			let token = crypto.randomBytes(32).toString('hex');

			let authUser = {
				id: user.id,
				email: user.email,
				first_name: user.first_name,
				last_name: user.last_name,
				token: token
			}

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
 *     description: Create list of users
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - User
 */
router.get('/users', function (req, res) {
	
	(async function () {

		try {
			let r = new userRepository(req.app);
			let results = await r.getUsers();
			res.send(results);
		} catch (e) {
			res.status(500);
			res.send(e.message);
		}

	})()

});

/**
 * @swagger
 * /users:
 *   post:
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     description: Create user
 *     parameters:
 *       - in: formData
 *         name: first_name
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *       - in: formData
 *         name: last_name
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *       - in: formData
 *         name: email
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *       - in: formData
 *         name: password
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
 *        - User
 */
router.post('/users',
	validateRequest({
		first_name: {
			isString: true,
			errorMessage: "first_name is required"
		},
		last_name: {
			isString: true,
			errorMessage: "last_name is required"
		},
		email: {
			isString: true,
			errorMessage: "email is required"
		},
		password: {
			isString: true,
			errorMessage: "password is required"
		},
	}),
	function (req, res) {
	(async function () {

		try {
			let hashedPassword = await password.hash(req.body.password);

			let r = new userRepository(req.app);
			// TODO validation
			let results = await r.createUser(
				req.body.first_name,
				req.body.last_name,
				req.body.email,
				hashedPassword,
			);

			res.send({message: "OK"});

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
 *     description: Deletes user
 *     parameters:
 *       - in: path
 *         name: user_id
 *         type: integer
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - User
 */
router.delete('/users/:user_id',
	validateRequest({
		user_id: {
			isInt: true,
			errorMessage: "user_id must be integer"
		},
	}),
	(req, res) => {

	(async function () {

		try {
			let r = new userRepository(req.app);
			let results = await r.deleteUser(req.params.user_id);
			res.send({message: "OK"});

		} catch (e ) {
			res.status(500);
			res.send(e.message);
		}

	})();

});

/**
 * @swagger
 * /users/:user_id:
 *   patch:
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     description: Create user
 *     parameters:
 *       - in: formData
 *         name: first_name
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *       - in: formData
 *         name: last_name
 *         type: string
 *         schema:
 *           type: string
 *         required: true
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
 *        - User
 */
router.patch('/users/:user_id',
	validateRequest({
		user_id: {
			isInt: true,
			errorMessage: "user_id must be integer"
		},
		first_name: {
			isString: true,
			errorMessage: "first_name is required"
		},
		last_name: {
			isString: true,
			errorMessage: "last_name is required"
		},
		email: {
			isString: true,
			errorMessage: "email is required"
		}
	}),
	(req, res) => {

	(async function () {

		try {
			let r = new userRepository(req.app);

			// TODO validation
			let results = await r.updateUser(
				req.params.user_id,
				req.body.first_name,
				req.body.last_name,
				req.body.email
			);
			res.send({message: "OK"});

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
 *     description: Create user
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
 *        - User
 */
router.post('/users/reset_password',
	validateRequest({
		email: {
			isString: true,
			errorMessage: "first_name is required"
		}
	}),
	function (req, res) {
		(async function () {

			try {
				let response = await sendResetPasswordEmail(req.body.email);
				console.log(response);
				res.send(response);

			} catch (e) {
				console.error(e);
				res.status(500);
				res.send(e.message);
			}

		})();

	});

module.exports = router;