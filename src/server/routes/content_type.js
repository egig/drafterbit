const express = require('express');
const config = require('../../config');
const ContentTypeRepository = require('../repository/ContentTypeRepository');
const validateRequest = require('../middlewares/validateRequest');

let router = express.Router();

/**
 * @swagger
 * /content_types/:content_type_id:
 *   get:
 *     description: Get content type
 *     parameters:
 *       - in: path
 *         name: content_type_id
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
 *        - Content Type
 */
router.get('/content_types/:content_type_id',
    validateRequest({
        content_type_id: {
            notEmpty: true,
            errorMessage: 'content_type_id is required'
        }
    }),
    function (req, res) {
        (async function () {

            try {
                let r = new ContentTypeRepository(req.app);
                let results = await r.getContentType(req.params.content_type_id);
                res.send(results);
            } catch (e ) {
                res.status(500);
                res.send(e.message);
            }

        })();
    });


/**
 * @swagger
 * /projects/:project_id/content_types:
 *   get:
 *     description: Get content types
 *     parameters:
 *       - in: path
 *         name: project_id
 *         type: integer
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - Content Type
 */
router.get('/projects/:project_id/content_types',
    validateRequest({
        project_id: {
            notEmpty: true,
            errorMessage: 'project_id required'
        }
    }),
    function (req, res) {
        (async function () {

            try {
                let r = new ContentTypeRepository(req.app);
                let results = await r.getContentTypes(req.params.project_id);
                res.send(results);
            } catch (e ) {
                res.status(500);
                res.send(e.message);
            }

        })();
    });

/**
 * @swagger
 * /projects/:project_id/content_types/:slug:
 *   get:
 *     description: Get content type by slug
 *     parameters:
 *       - in: path
 *         name: project_id
 *         type: integer
 *         schema:
 *           type: integer
 *         required: true
 *       - in: path
 *         name: slug
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - Content Type
 */
router.get('/projects/:project_id/content_types/:slug',
    validateRequest({
        project_id: {
            notEmpty: true,
            errorMessage: 'project_id is required'
        },
        slug: {
            isString: true,
            errorMessage: 'slug is required'
        }
    }),
    function (req, res) {
        (async function () {

            try {
                let r = new ContentTypeRepository(req.app);
                let result = await r.getContentTypeBySlug(req.params.project_id, req.params.slug);

                res.send(result);
            } catch (e ) {
                res.status(500);
                res.send(e.message);
            }

        })();

    });


/**
 * @swagger
 * /projects/{project_id}/content_types:
 *   post:
 *     consumes:
 *       - application/json
 *     description: Create content type
 *     parameters:
 *       - in: path
 *         name: project_id
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *       - in: body
 *         name: content_type
 *         schema:
 *           type: object
 *           required:
 *              - name
 *           properties:
 *             name:
 *               type: string
 *             slug:
 *               type: string
 *             description:
 *               type: string
 *             fields:
 *               type: array
 *               properties:
 *                 type_id:
 *                   type: int
 *                 label:
 *                   type: string
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - Content Type
 */
router.post('/projects/:project_id/content_types',
    validateRequest({
        project_id: {
            notEmpty: true,
            errorMessage: 'project_id required'
        },
        name: {
            notEmpty: true,
            errorMessage: 'name is required'
        },
        slug: {
            notEmpty: true,
            errorMessage: 'slug is required'
        },
        description: {
            optional: true,
            isString: true,
            errorMessage: 'description must be string'
        },
        fields: {
            isArray: true,
            errorMessage: 'fields must be array'
        }
    }),
    function (req, res) {

        (async function () {

            try {
                let r = new ContentTypeRepository(req.app);
                let results = await r.createContentType(req.body.name, req.body.slug,
                    req.body.description, req.params.project_id, req.body.fields);
                res.send(results);
            } catch (e ) {
                console.log(e);
                res.status(500);
                res.send(e.message);
            }

        })();

    });

/**
 * @swagger
 * /content_types/:content_type_id:
 *   delete:
 *     description: Delete content type
 *     parameters:
 *       - in: query
 *         name: content_type_id
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
 *        - Content Type
 */
router.delete('/content_types/:content_type_id',
    validateRequest({
        content_type_id: {
            notEmpty: true,
            errorMessage: 'content_type_id required'
        }
    }),
    function (req, res) {

        (async function () {

            try {
                let r = new ContentTypeRepository(req.app);
                let results = await r.deleteContentType(req.params.content_type_id);
                res.send(results);
            } catch (e ) {
                res.status(500);
                res.send(e.message);
            }

        })();

    });

/**
 * @swagger
 * /content_types/:content_type_id:
 *   patch:
 *     consumes:
 *       - application/json
 *     description: Update content type
 *     parameters:
 *       - in: path
 *         name: content_type_id
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *       - in: body
 *         name: content_type
 *         schema:
 *           type: object
 *           required:
 *              - name
 *           properties:
 *             name:
 *               type: string
 *             slug:
 *               type: string
 *             description:
 *               type: string
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - Content Type
 */
router.patch('/content_types/:content_type_id',
    validateRequest({
        content_type_id: {
            notEmpty: true,
            errorMessage: 'content_type_id is required'
        },
        name: {
            optional: true,
            errorMessage: 'name is required'
        },
        slug: {
            optional: true,
            errorMessage: 'slug is required'
        },
        description: {
            optional: true,
            errorMessage: 'description must be string'
        },
    }),
    function (req, res) {

        (async function () {

            try {
                let r = new ContentTypeRepository(req.app);
                let results = await r.updateContentType(req.params.content_type_id, req.body);
                res.send(results);
            } catch (e ) {
                res.status(500);
                res.send(e.message);
            }

        })();

    });

module.exports = router;