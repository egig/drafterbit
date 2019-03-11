const express = require('express');
let router = express.Router();
const ContentTypeRepository = require('../repository/ContentTypeRepository');

router.get("/_swagger_spec.json",  function (req, res) {

	(async function () {

		try {
			let r = new ContentTypeRepository(req.app);
			let results = await r.getContentTypes();

			let swaggerSpec = {
				"swagger": "2.0",
				"info": {
					"title": "",
					"description": "",
					"version": "1.0"
				},
				"produces": ["application/json"],
				"host": "localhost:8000",
				"basePath": "/",
			}

			let paths = {};
			results.map((r) => {

				let parameters = r.fields.map(f => {
					return {
						in: "body",
						name: f.name,
						type: "string",
						description: f.label
					}
				});

				paths[`/${r.slug}`] = {
					"get": {
						"tags": [`/${r.slug}`],
						"description": "",
						"parameters": [],
						"responses": {}
					},
					"post": {
						"tags": [`/${r.slug}`],
						"description": "",
						"parameters": parameters,
						"responses": {}
					}
				}

				paths[`/${r.slug}/{${r.slug}_id}`] = {
					"patch": {
						"tags": [`/${r.slug}`],
						"description": "",
						"parameters": parameters,
						"responses": {}
					},
					"delete": {
						"tags": [`/${r.slug}`],
						"description": "",
						"parameters": [],
						"responses": {}
					}
				}
			});

			swaggerSpec.paths = paths;

			res.send(swaggerSpec);
		} catch (e ) {
			res.status(500);
			res.send(e.message);
		}

	})();
});


module.exports = router;