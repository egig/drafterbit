// /During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
let chai = require('chai');
let chaiHttp = require('chai-http');
let drafterbit = require('../../../../src'); // TODO make this global ?
let ContentTypeSchema = require('../models/ContentType');
let should = chai.should();
let expect = chai.expect;

mongoose.set('useFindAndModify', false);

chai.use(chaiHttp);
const mongod = new MongoMemoryServer();
let conn;
describe('Content', () => {

    before(async () => {

        const port = await mongod.getPort();
        const dbName = await mongod.getDbName();
        const mongoURI = await mongod.getConnectionString();
        
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

        // const opts = { useMongoClient: true }; 
        conn = mongoose.createConnection(mongoURI); 
        ContentType = conn.model(`${dbName}_ContentType`, ContentTypeSchema, '_content_types');
  
        let testCT = new ContentType({
            name: 'Articles',
            slug: 'articles',
            fields: [{
                type_id: 1,
                name: 'title',
                label: 'Title',
            }]
        });
  
        await testCT.save();

        drafterbit.boot(options);
    });

    after(async () => {
	    mongod.stop();
    });

    describe('GET content list', () => {
        it('it should get all the content with certain slug', (done) => {
            chai.request(drafterbit)
                .get('/articles?api_key=test')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });

        it('it should response 404 if certain slug not listed as content types', (done) => {
            chai.request(drafterbit)
                .get('/notexistingtype?api_key=test')
                .end((err, res) => {
                    res.should.have.status(404);                    
                    res.text.should.be.eql('Not Found');
                    done();
                });
        });
    });

    describe('POST content', () => {
        it('it should create content', done => {
            chai.request(drafterbit)
                .post('/articles?api_key=test')
                .send({
                    title: 'Test article 1',
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('should return a record after creation', done => {
            chai.request(drafterbit)
                .get('/articles?api_key=test')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });
    });

    describe('GET content item', () => {
        let testId;
        before((done) => {
            chai.request(drafterbit)
                .post('/articles?api_key=test')
                .send({
                    title: 'Test article 2',
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    testId = res.body.item._id;
                    done();
                });
        });

        it('should return get single record just fine', done => {
            chai.request(drafterbit)
                .get(`/articles/${testId}?api_key=test`)
                .end((err, res) => {
                    res.should.have.status(200);
                    expect(res.body.title).to.be.eql('Test article 2');
                    done();
                });
        });

        it('should support run DELETE without error', done => {
            chai.request(drafterbit)
                .delete(`/articles/${testId}?api_key=test`)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe('PATCH content', () => {
      
        let testId;
        before((done) => {
            chai.request(drafterbit)
                .post('/articles?api_key=test')
                .send({
                    title: 'Test article 1',
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    // console.log(res.body.item._id);                        
                    testId = res.body.item._id;
                    done();
                });
        });

        it('it should update content', done => {
            chai.request(drafterbit)
                .patch(`/articles/${testId}?api_key=test`)
                .send({
                    title: 'Test article 1 Edited',
                })
                .end((err, res) => {
                    res.should.have.status(200);

                    chai.request(drafterbit)
                        .get(`/articles/${testId}?api_key=test`)
                        .end((err, res) => {
                            expect(res.body.title).to.be.eql('Test article 1 Edited');
                            done();                             
                        });
                });
        });
        
    });

});