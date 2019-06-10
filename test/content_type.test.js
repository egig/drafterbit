// /During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/drafterbit_test");

let { ContentType } = require('../src/model');
let USER = "5b778f48186352071b132468";
let PROJECT = "5b7797e008798d0d88af1891";

// //Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);

describe('Content Types', () => {

	// TODO this always timeout exceed
	before((done) => {
		ContentType.remove({}, (err) => {
			if(err) throw err;
			done();
		});
	});

	describe('/DELETE content types', () => {

		it('it should delete a content types', (done) => {

			let ct = new ContentType({
				name: "test ct",
				slug: "test-ct",
				description: "desc",
				project: PROJECT
			});

			ct.save((err, ct) => {

				chai.request(server)
					.delete(`/content_types/${ct._id}`)
					.end((err, res) => {
						res.should.have.status(200);
						// res.body.should.be.a('array');
						// res.body.length.should.be.eql(0);
						done();
					});
			});
		});

	});

	describe('/GET content types', () => {
		it('it should get all the content types', (done) => {
			chai.request(server)
				.get(`/projects/${PROJECT}/content_types`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be.eql(0);
					done();
				});
		});
	});



	describe('/POST content types', () => {
		it('it should create a content type', (done) => {
			chai.request(server)
				.post(`/projects/${PROJECT}/content_types`)
				.send({
					name: "test ct",
					slug: "test-ct",
					description: "desc",
					fields: []
				})
				.end((err, res) => {
					res.should.have.status(200);
					done();
				});
		});

		it('it should get one project after add', (done) => {
			chai.request(server)
				.get(`/projects/${PROJECT}/content_types`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be.eql(1);
					done();
				});
		});
	});

	describe('/PATCH content types', () => {

		it('it should update a content type', (done) => {

			let ct = new ContentType({
				name: "test ct",
				slug: "test-ct",
				description: "desc",
				project: PROJECT
			});

			ct.save((err, ct) => {

				chai.request(server)
					.patch(`/content_types/${ct._id}`)
					.send({
						name: "Edited"
					})
					.end((err, res) => {
						res.should.have.status(200);

						ContentType.findOne({_id: ct._id}, (err, p) => {
							expect(p.name).to.be.equal("Edited");

							done();
						});
					});
			});

		});

	});

});