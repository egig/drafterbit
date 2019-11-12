// /During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const { MongoMemoryServer } = require('mongodb-memory-server');
let chai = require('chai');
let chaiHttp = require('chai-http');
let drafterbit = require('../../../../src')(); // TODO make this global ?
let should = chai.should();

chai.use(chaiHttp);
const mongod = new MongoMemoryServer();

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
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

});