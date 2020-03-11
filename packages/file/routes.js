const path = require('path');
const express = require('express');
const validateRequest = require('@drafterbit/drafterbit/middlewares/validateRequest');
const FileServer = require('./FileServer');

let router = express.Router();

/**
 * @swagger
 * /files:
 *   get:
 *     description: Get files
 *     parameters:
 *       - in: query
 *         name: op
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: path
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
router.get('/files',
    function (req, res) {
        (async function () {

            try {

                let basePath = path.join(req.app.get('config').get('ROOT_DIR'),req.app.get('config').get('FILES_BASE_PATH'));
                let fServer = new FileServer(basePath);
                fServer.handle(req, res);

            } catch (e ) {
                res.status(500);
                res.send(e.message);
            }

        })();
    });

router.post('/files',
    function (req, res) {
        (async function () {

            try {

                let basePath = path.join(req.app.get('config').get('ROOT_DIR'),req.app.get('config').get('FILES_BASE_PATH'));
                let fServer = new FileServer(basePath);
                fServer.handle(req, res);

            } catch (e ) {
                res.status(500);
                res.send(e.message);
            }

        })();
    });


router.put('/files',
    function (req, res) {
        (async function () {

            try {
                let basePath = path.join(req.app.get('config').get('ROOT_DIR'),req.app.get('config').get('FILES_BASE_PATH'));
                let fServer = new FileServer(basePath);
                fServer.handleUpload(req, res);

            } catch (e ) {
                console.log(e);
                res.status(500);
                res.send(e.message);
            }

        })();
    });

module.exports = router;