// /During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const { MongoMemoryServer } = require('mongodb-memory-server');
let chai = require('chai');
let chaiHttp = require('chai-http');
let drafterbit = require('../../../../src')(); // TODO make this global ?
let should = chai.should();

chai.use(chaiHttp);
const mongod = new MongoMemoryServer();

describe('Content Types', () => {

    // TODO this always timeout exceed
    before(async () => {

        const port = await mongod.getPort();
        const dbName = await mongod.getDbName();
        let options = {
            'ROOT_DIR': __dirname,
            'DEBUG': false,
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

        drafterbit.boot(options);
        drafterbit.routing();

    });

    after(async () => {
	    mongod.stop();
    });

    describe('/DELETE content types', () => {

        let testId;
        before((done) => {

            // TODO using mongoose to create fixtures instead
            chai.request(drafterbit)
                .post('/content_types?api_key=test')
                .send({
                    name: 'test ct4',
                    slug: 'test-ct4',
                    description: 'desc',
                    fields: []
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    testId = res.body._id;
                    done();
                });
        });

        it('it should delete a content types', (done) => {
            chai.request(drafterbit)
                .delete(`/content_types/${testId}?api_key=test`)
                .end((err, res) => {
                    res.should.have.status(200);

                    chai.request(drafterbit)
                        .get('/content_types?api_key=test')
                        .end((err, res) => {
                            res.body.should.be.a('array');
                            res.body.length.should.be.eql(0);
                            done();
                        });
                });
        });
    });

    describe('/GET content types', () => {
        it('it should get all the content types', (done) => {
            chai.request(drafterbit)
                .get('/content_types?api_key=test')
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
            chai.request(drafterbit)
                .post('/content_types?api_key=test')
                .send({
                    name: 'test ct',
                    slug: 'test-ct',
                    description: 'desc',
                    fields: []
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('it should get one after add', (done) => {
            chai.request(drafterbit)
                .get('/content_types?api_key=test')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });
    });

    describe('/GET content types/:id ', () => {

        let testId;
        before((done) => {

            chai.request(drafterbit)
                .post('/content_types?api_key=test')
                .send({
                    name: 'test ct2',
                    slug: 'test-ct2',
                    description: 'desc',
                    fields: []
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    testId = res.body._id;
                    done();
                });
        });

        it('it should get a content type by id', (done) => {

            chai.request(drafterbit)
                .get(`/content_types/${testId}?api_key=test`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });

    });

    describe('/PATCH content types/:id', () => {

        let testId;
        before((done) => {

            chai.request(drafterbit)
                .post('/content_types?api_key=test')
                .send({
                    name: 'test ct3',
                    slug: 'test-ct3',
                    description: 'desc',
                    fields: []
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    testId = res.body._id;
                    done();
                });
        });

        it('it should update a content type', (done) => {

            chai.request(drafterbit)
                .patch(`/content_types/${testId}?api_key=test`)
                .send({
                    name: 'test ct3 edited',
                })
                .end((err, res) => {
                    // res.should.have.status(200);

                    chai.request(drafterbit)
                        .get(`/content_types/${testId}?api_key=test`)
                        .end((err, res) => {
                            res.body.name.should.be.eql('test ct3 edited');
                            res.body.slug.should.be.eql('test-ct3');
                            done();
                        });

                    // done();
                });
        });

    });

});