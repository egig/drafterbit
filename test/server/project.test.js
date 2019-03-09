// /During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/drafterbit_test");

let { Project } = require('../src/model');
let USER = "5b778f48186352071b132468";

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);

describe('Projects', () => {

	// TODO this always timeout exceed
	before((done) => {
		Project.remove({}, (err) => {
			if(err) throw err;
			done();
		});
	});

	describe('/DELETE projects', () => {

		it('it should delete a project', (done) => {

			let np = new Project({
				name: "test project",
				description: "desc",
				owner: USER
			});

			np.save((err, np) => {

				chai.request(server)
					.delete(`/projects/${np._id}`)
					.end((err, res) => {
						res.should.have.status(200);
						// res.body.should.be.a('array');
						// res.body.length.should.be.eql(0);
						done();
					});
			});
		});

	});


	describe('/GET projects', () => {
		it('it should get all the projects', (done) => {
			chai.request(server)
				.get(`/users/${USER}/projects`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be.eql(0);
					done();
				});
		});
	});



	describe('/POST projects', () => {
		it('it should create a project', (done) => {
			chai.request(server)
				.post(`/users/${USER}/projects`)
				.send({
					name: "test project",
					description: "desc",
				})
				.end((err, res) => {
					res.should.have.status(200);
					done();
				});
		});

		it('it should get one project after add', (done) => {
			chai.request(server)
				.get(`/users/${USER}/projects`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be.eql(1);
					done();
				});
		});
	});

	describe('/PATCH projects', () => {

		it('it should update a project', (done) => {

			let np = new Project({
				name: "test project",
				description: "desc",
				owner: USER
			});

			np.save((err, user) => {

				chai.request(server)
					.patch(`/projects/${np._id}`)
					.send({
						name: "Edited"
					})
					.end((err, res) => {
						res.should.have.status(200);

						Project.findOne({_id: user._id}, (err, p) => {
							expect(p.name).to.be.equal("Edited");

							done();
						});
					});
			});

		});

	});

});