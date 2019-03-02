// /During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/drafterbit_test");

let { User } = require('../src/model');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);

describe('Users', () => {

	// TODO this always timeout exceed
	before((done) => {
		User.remove({}, (err) => {
			if(err) throw err;
			done();
		});
	});

	describe('/DELETE users', () => {

		it('it should delete a the users', (done) => {

			let user = new User({
				first_name: "John",
				last_name: "Doe",
				email: "test@test.test",
				password: "test"
			});

			user.save((err, user) => {

				chai.request(server)
					.delete(`/users/${user._id}`)
					.end((err, res) => {
						res.should.have.status(200);
						// res.body.should.be.a('array');
						// res.body.length.should.be.eql(0);
						done();
					});
			});

		});

	});

	/*
	 * Test the /GET route
	 */
	describe('/GET users', () => {
		it('it should get all the users', (done) => {
			chai.request(server)
				.get('/users')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be.eql(0);
					done();
				});
		});
	});

	describe('/POST users', () => {
		it('it should create a users', (done) => {
			chai.request(server)
				.post('/users')
				.send({
					first_name: "John",
					last_name: "Doe",
					email: "test@test.test",
					password: "test"
				})
				.end((err, res) => {
					res.should.have.status(200);
					done();
				});
		});

		it('it should get one user after add', (done) => {
			chai.request(server)
				.get('/users')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be.eql(1);
					done();
				});
		});
	});

	describe('/PATCH users', () => {

		it('it should update a the users', (done) => {

			let user = new User({
				first_name: "John",
				last_name: "Doe",
				email: "test@test.test",
				password: "test"
			});

			user.save((err, user) => {

				chai.request(server)
					.patch(`/users/${user._id}`)
					.send({
						last_name: "Connor"
					})
					.end((err, res) => {
						res.should.have.status(200);
						// res.body.should.be.a('array');
						// res.body.length.should.be.eql(0);

						User.findOne({_id: user._id}, (err, user) => {
							expect(user.last_name).to.be.equal("Connor");

							done();
						});
					});
			});

		});

	});

});

// ObjectId("5b778f48186352071b132468")