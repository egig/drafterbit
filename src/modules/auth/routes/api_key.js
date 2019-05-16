import express from 'express';
import ApiKeyRespository from '../repository/ApiKeyRespository';
import crypto from 'crypto';
import validateRequest from '../../middlewares/validateRequest';

let router = express.Router();

/**
 * @swagger
 * /api_keys:
 *   get:
 *     description: Get api keys
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - API Key
 */
router.get('/api_keys',
    function (req, res) {

        (async function () {

            try {
                let r = new ApiKeyRespository(req.app);
                let results = await r.getApiKeys();
                res.send(results);
            } catch (e ) {
                res.status(500);
                res.send(e.message);
            }

        })();

    });

/**
 * @swagger
 * /api_keys:
 *   post:
 *     consumes:
 *       - application/json
 *     description: Create api key
 *     parameters:
 *       - in: body
 *         name: payload
 *         schema:
 *           type: object
 *           required:
 *             - name
 *             - key
 *           properties:
 *             name:
 *               type: string
 *             key:
 *               type: string
 *             restriction_type:
 *               type: string
 *             restriction_value:
 *               type: string
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - API Key
 */
router.post('/api_keys',
    validateRequest({
        name: {
            isString: true,
            errorMessage: 'name is required'
        },
        restriction_type: {
            isInt: true,
            errorMessage: 'restriction_type must be integer'
        },
        restriction_value: {
            isString: true,
            errorMessage: 'restriction_value is required'
        }
    }),
    function (req, res) {

        (async function () {

            try {

                let r = new ApiKeyRespository(req.app);
                // TODO validation
                await r.createApiKey(
                    req.body.name,
                    crypto.randomBytes(32).toString('hex'),
                    req.body.restriction_type,
                    req.body.restriction_value
                );
                res.send({message: 'OK'});

            } catch (e ) {
                res.status(500);
                res.send(e.message);
            }

        })();

    });


/**
 * @swagger
 * /api_keys/:api_key_id:
 *   get:
 *     description: Get api key
 *     parameters:
 *       - in: path
 *         name: api_key_id
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
 *        - API Key
 */
router.get('/api_keys/:api_key_id',
    validateRequest({
        api_key_id: {
            notEmpty: true,
            errorMessage: 'api_key_id is required'
        }
    }),
    (req, res) => {

        (async function () {

            try {
                let r = new ApiKeyRespository(req.app);
                let results = await r.getApiKey(req.params.api_key_id);
                res.send(results);

            } catch (e ) {
                res.status(500);
                res.send(e.message);
            }

        })();

    });

/**
 * @swagger
 * /api_keys/:api_key_id:
 *   delete:
 *     description: Delete api key
 *     parameters:
 *       - in: path
 *         name: api_key_id
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
 *        - API Key
 */
router.delete('/api_keys/:api_key_id',
    validateRequest({
        api_key_id: {
            notEmpty: true,
            errorMessage: 'api_key_id must be integer'
        }
    }),
    (req, res) => {

        (async function () {

            try {
                let r = new ApiKeyRespository(req.app);
                await r.deleteApiKey(req.params.api_key_id);
                res.send({message: 'OK'});

            } catch (e ) {
                res.status(500);
                res.send(e.message);
            }

        })();

    });

/**
 * @swagger
 * /api_keys/:api_key_id:
 *   patch:
 *     description: Update api key
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: api_key_id
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *       - in: body
 *         name: payload
 *         schema:
 *           type: object
 *           required:
 *             - name
 *             - key
 *           properties:
 *             name:
 *               type: string
 *             key:
 *               type: string
 *             restriction_type:
 *               type: string
 *             restriction_value:
 *               type: string
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - API Key
 */
router.patch('/api_keys/:api_key_id',
    validateRequest({
        api_key_id: {
            notEmpty: true,
            errorMessage: 'api_key_id must be integer'
        },
        name: {
            optional: true,
            errorMessage: 'name is required'
        },
        restriction_type: {
            optional: true,
            errorMessage: 'restriction_type must be integer'
        },
        restriction_value: {
            optional: true,
            errorMessage: 'restriction_value is required'
        }
    }),
    (req, res) => {

        (async function () {

            try {
                let r = new ApiKeyRespository(req.app);

                // TODO validation
                await r.updateApiKey(
                    req.params.api_key_id,
                    req.body
                );
                res.send({message: 'OK'});

            } catch (e) {
                res.status(500);
                res.send(e.message);
            }

        })();
    });

export default router;