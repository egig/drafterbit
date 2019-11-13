// /During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const { MongoMemoryServer } = require('mongodb-memory-server');
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');
let drafterbit = require('../../../../src')(); // TODO make this global ?
let should = chai.should();
let expect = chai.expect;
let ApiKeySchema = require('../models/ApiKey');

chai.use(chaiHttp);
const mongod = new MongoMemoryServer();
let apikeyModel;
let apiKeyId;

describe('ApiKeys', () => {

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
        apikeyModel = conn.model('ApiKey', ApiKeySchema, '_api_keys');

        let newApiKey = new apikeyModel({
            name: 'Api Key 1',
            key: 'Vo675diOW3TT9xuIW1N8tNiIP4rW6y5500QaaF5sIBq8XG',
            restriction_type: 'foo@bar.com',
            restriction_value: '' //123
        });
        newApiKey = await newApiKey.save();
        apiKeyId = newApiKey._id;

        drafterbit.boot(options);
    });

    after(async () => {
	    mongod.stop();
    });

    describe('/GET api_keys', () => {
        it('it should get all apiKeys', (done) => {
            chai.request(drafterbit)
                .get('/api_keys?api_key=test')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });
    });

    describe('/GET api key', () => {
        it('it should get an apikey based on given id', (done) => {
            chai.request(drafterbit)
                .get(`/api_keys/${apiKeyId}?api_key=test`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.name.should.be.eq('Api Key 1');
                    done();
                });
        });
    });

    describe('/PATCH api key', () => {
        it('it should update a user based on given id', (done) => {
            chai.request(drafterbit)
                .patch(`/api_keys/${apiKeyId}?api_key=test`)
                .send({
                    name: 'test edit',
                })
                .end((err, res) => {
                    res.should.have.status(200);

                    apikeyModel.findOne({_id: apiKeyId}, function (err, result) {
                        expect(result.name).to.eq('test edit');
                        done();
                    });
                });
        });
    });

    describe('/DELETE api key', () => {
        it('it should delete a user based on given id', (done) => {
            chai.request(drafterbit)
                .delete(`/api_keys/${apiKeyId}?api_key=test`)
                .end((err, res) => {
                    res.should.have.status(200);

                    apikeyModel.findOne({_id: apiKeyId}, function (err, result) {
                        expect(result).to.eq(null);
                        done();
                    });

                });
        }) ;
    });

    describe('/POST api key', () => {
        it('it should create a user', (done) => {
            chai.request(drafterbit)
                .post('/api_keys?api_key=test')
                .send({
                    name: 'test',
                    key: 'testkey',
                    restriction_type: 0,
                    restriction_value: ''
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    done();
                });
        });
    });

});