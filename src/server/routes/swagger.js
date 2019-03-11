const express = require('express');
let router = express.Router();
const ContentTypeRepository = require('../repository/ContentTypeRepository');

let getSwaggerSpec = function () {
	return new Promise((resolve, reject) => {

		let swaggerSpec = {
			"swagger": "2.0",
			"info": {
				"title": "",
				"description": "",
				"version": "1.0"
			},
			"produces": ["application/json"],
			"host": "localhost:8000",
			"basePath": "/api/swagger/v1",
			"paths": {
				"/test1": {
					"get": {
						"x-swagger-router-controller": "middleware-name1",
						"operationId": "swagTest",
						"tags": ["/test"],
						"description": "",
						"parameters": [],
						"responses": {}
					}
				}
			}
		}

		resolve(swaggerSpec);
	})
};


app.get("/_swagger_spec.json",  function (req, res) {

	(async function () {

		try {
			let r = new ContentTypeRepository(req.app);
			let results = await r.getContentTypes();
			res.send(results);
		} catch (e ) {
			res.status(500);
			res.send(e.message);
		}

	})();

	getSwaggerSpec()
		.then(r => {
			res.send(r);
		})
});


module.exports = router;