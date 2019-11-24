const path = require('path');
const express = require('express');
const validateRequest = require('../../middlewares/validateRequest');
const FileServer = require('./FileServer');
const multer = require('multer')
const upload = multer({ dest: 'files/' });


let router = express.Router();

/**
 * @swagger
 * /files:
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
router.get('/files',
    function (req, res) {
        (async function () {

            try {

                let basePath = path.join(req.app._root,req.app.get('config').get("filesBasePath"));
                let fServer = new FileServer(basePath);
                fServer.handle(req, res);

            } catch (e ) {
                res.status(500);
                res.send(e.message);
            }

        })();
    });

module.exports = router;