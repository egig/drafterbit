// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/drafterbit_test");

let { Content } = require('../src/model');
let USER = "5b778f48186352071b132468";
let PROJECT = "5b7797e008798d0d88af1891";
let CONTENT_TYPE = "5b77d1625ee1980fa9901c25";

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);
//
describe('Contents', () => {

	before((done) => {
		Content.remove({}, (err) => {
			if(err) throw err;
			done();
		});
	});

	describe('/DELETE content types', () => {

		it('it should delete a content', (done) => {

			let ct = new Content({
				content_type: CONTENT_TYPE,
				fields: [
					{
						type_id: 1,
						type_name: "Short Text",
						name: "title",
						display_name: "Title",
						value: "this is title example"
					}
				]
			});

			ct.save((err, ct) => {

				chai.request(server)
					.delete(`/contents/${ct._id}`)
					.end((err, res) => {
						res.should.have.status(200);
						done();
					});
			});
		});

	});

	describe('/GET content', () => {
		it('it should get all the content', (done) => {
			chai.request(server)
				.get(`/content_types/${CONTENT_TYPE}/contents`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be.eql(0);
					done();
				});
		});
	});



	describe('/POST content', () => {
		it('it should create a contet', (done) => {
			chai.request(server)
				.post(`/content_types/${CONTENT_TYPE}/contents`)
				.send({
					fields: [{
						type_id: 1,
						type_name: "Short Text",
						name: "title",
						display_name: "Title",
						value: "Test title"
					}]
				})
				.end((err, res) => {
					res.should.have.status(200);
					done();
				});
		});

		it('it should get one project after add', (done) => {
			chai.request(server)
				.get(`/content_types/${CONTENT_TYPE}/contents`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be.eql(1);
					done();
				});
		});
	});

	describe('/PATCH content', () => {

		it('it should update a content', (done) => {

			let ct = new Content({
				content_type: CONTENT_TYPE,
				fields: [
					{
						type_id: 1,
						type_name: "Short Text",
						name: "title",
						display_name: "Title",
						value: "this is title example"
					}
				]
			});

			ct.save((err, ct) => {

				chai.request(server)
					.patch(`/contents/${ct._id}`)
					.send({
						fields: [
							{
								type_id: 1,
								type_name: "Short Text",
								name: "title",
								display_name: "Title",
								value: "this is title example"
							},
							{
								type_id: 1,
								type_name: "Short Text",
								name: "title",
								display_name: "Title",
								value: "this is title example"
							},
						]
					})
					.end((err, res) => {
						res.should.have.status(200);

						Content.findOne({_id: ct._id}, (err, p) => {
							expect(p.fields.length).to.be.equal(2);

							done();
						});
					});
			});

		});

	});

});
