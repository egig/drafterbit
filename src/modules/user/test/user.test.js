// /During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const { MongoMemoryServer } = require('mongodb-memory-server');
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');
let drafterbit = require('../../../../src')(); // TODO make this global ?
let should = chai.should();
let expect = chai.expect;
let UserSchema = require('../models/User');

chai.use(chaiHttp);
const mongod = new MongoMemoryServer();
let userModel;
let userId;

describe('Users', () => {

    // TODO this always timeout exceed
    before(async () => {

        const port = await mongod.getPort();
        const dbName = await mongod.getDbName();
        let options = {
            'ROOT_DIR': __dirname,
            'debug': false,
            'PORT': 3000,
            'SESSION_SECRET': 'secr3t',
            'MONGODB_PROTOCOL': 'mongodb',
            'MONGODB_HOST': 'localhost',
            'MONGODB_PORT': port,
            'MONGODB_USER': '',
            'MONGODB_PASS': '',
            'MONGODB_NAME': dbName,
            'ADMIN_API_KEY': 'test',
            'modules': [
                '../index'
            ]
        };


        let uri = `mongodb://localhost:${port}/${dbName}?retryWrites=true&w=majority`;
        let conn = mongoose.createConnection(uri, {});
        userModel = conn.model('User', UserSchema, '_users');

        let newUser = new userModel({
            name: 'foo',
            email: 'foo@bar.com',
            password: '$2a$05$DiMFhbLVo675diOW3TT9xuIW1N8tNiIP4rW6y5500QaaF5sIBq8XG' //123
        });
        newUser = await newUser.save();
        userId = newUser._id;

        drafterbit.boot(options);
    });

    after(async () => {
	    mongod.stop();
    });

    describe('/GET users', () => {
        it('it should get all users', (done) => {
            chai.request(drafterbit)
                .get('/users?api_key=test')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });
    });

    describe('/GET user', () => {
        it('it should get a user based on given id', (done) => {
            chai.request(drafterbit)
                .get(`/users/${userId}?api_key=test`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.email.should.be.eq('foo@bar.com');
                    done();
                });
        });
    });

    describe('/PATCH user', () => {
        it('it should delete a user based on given id', (done) => {
            chai.request(drafterbit)
                .patch(`/users/${userId}`)
                .send({
                    name: 'foo2',
                })
                .end((err, res) => {
                    res.should.have.status(200);

                    userModel.findOne({_id: userId}, function (err, result) {
                        expect(result.name).to.eq('foo2');
                        done();
                    });
                });
        });
    });

    describe('/DELETE user', () => {
        it('it should delete a user based on given id', (done) => {
            chai.request(drafterbit)
                .delete(`/users/${userId}?api_key=test`)
                .end((err, res) => {
                    res.should.have.status(200);

                    userModel.findOne({_id: userId}, function (err, result) {
                        expect(result).to.eq(null);
                        done();
                    });

                });
        }) ;
    });

    describe('/POST user', () => {
        it('it should delete a user based on given id', (done) => {
            chai.request(drafterbit)
                .post('/users?api_key=test')
                .send({
                    name: 'foo',
                    email: 'foo@bar.com',
                    password: 'admin123'
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    done();
                });
        });
    });

});