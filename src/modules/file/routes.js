const path = require('path');
const express = require('express');
const validateRequest = require('../../middlewares/validateRequest');
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

                let basePath = path.join(req.app._root,req.app.get('config').get('filesBasePath'));
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

                let basePath = path.join(req.app._root,req.app.get('config').get('filesBasePath'));
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

                let basePath = path.join(req.app._root,req.app.get('config').get('filesBasePath'));
                let fServer = new FileServer(basePath);
                fServer.handleUpload(req, res);

            } catch (e ) {
                console.log(e)
                res.status(500);
                res.send(e.message);
            }

        })();
    });

module.exports = router;