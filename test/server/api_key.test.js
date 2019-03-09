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
let should = chai.should();33
let expect = chai.expect;

chai.use(chaiHttp);

describe('Api Keys', () => {

	// TODO this always timeout exceed
	before((done) => {
		ApiKey.remove({}, (err) => {
			if(err) throw err;
			done();
		});
	});

	describe('/DELETE api keys', () => {

		it('it should delete an api key', (done) => {

			let ak = new ApiKey({
				name: "test api key",
				key: "key123",
				restriction_type: 1,
				restriction_value: "",
				project: PROJECT
			});

			ak.save((err, ak) => {

				chai.request(server)
					.delete(`/api_keys/${ak._id}?api_key=test`)
					.end((err, res) => {
						res.should.have.status(200);
						done();
					});
			});
		});
	});

	describe('/GET api keys', () => {
		it('it should get all the api keys', (done) => {
			chai.request(server)
				.get(`/projects/${PROJECT}/api_keys?api_key=test`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be.eql(0);
					done();
				});
		});
	});



	describe('/POST api keys', () => {
		it('it should create an api key', (done) => {
			chai.request(server)
				.post(`/projects/${PROJECT}/api_keys?api_key=test`)
				.send({
					name: "test api key",
					key: "key123",
					restriction_type: 1,
					restriction_value: ""
				})
				.end((err, res) => {
					res.should.have.status(200);
					done();
				});
		});

		it('it should get one api key after add', (done) => {
			chai.request(server)
				.get(`/projects/${PROJECT}/api_keys?api_key=test`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be.eql(1);
					done();
				});
		});
	});

	describe('/PATCH api keys', () => {

		it('it should update an api key', (done) => {

			let ak = new ApiKey({
				name: "test api key",
				key: "key123",
				restriction_type: 1,
				restriction_value: "",
				project: PROJECT
			});

			ak.save((err, ak) => {

				chai.request(server)
					.patch(`/api_keys/${ak._id}?api_key=test`)
					.send({
						name: "Edited"
					})
					.end((err, res) => {
						res.should.have.status(200);

						ApiKey.findOne({_id: ak._id}, (err, p) => {
							expect(p.name).to.be.equal("Edited");

							done();
						});
					});
			});

		});

	});

});