// 95e8d8331a293e02d32ce7c3656ee4e9b4316e9c0a98098d630e7d69fb44f2e5

// /During the test the env variable is set to test
process.env.NODE_ENV = 'test_auth';

let mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/drafterbit_test");

let { ApiKey } = require('../src/model');
let USER = "5b778f48186352071b132468";
let PROJECT = "5b7797e008798d0d88af1891";

// //Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);

describe('Api Key Auth', () => {

	before((done) => {
		ApiKey.remove({}, (err) => {
			if(err) throw err;
			done();
		});
	});

	describe('Api Key Auth Middleware', () => {

		// skip for all run
		xit('it should deny if no api key', (done) => {
			chai.request(server)
				.get(`/projects/${PROJECT}/api_keys`)
				.end((err, res) => {
					res.should.have.status(403);
					done();
				});
		});

		it('is should works', (done) => {
			let ak = new ApiKey({
				name: "test api key",
				key: "5e8d8331a293e02d32ce7c3656ee4e9",
				restriction_type: 1,
				restriction_value: "",
				project: PROJECT
			});

			ak.save((err, ak) => {

				chai.request(server)
					.get(`/projects/${PROJECT}/api_keys?api_key=5e8d8331a293e02d32ce7c3656ee4e9`)
					.end((err, res) => {
						res.should.have.status(200);
						done();
					});
			});

		})
	});

});