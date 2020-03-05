const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const cors = require('cors');

const createConfig = require('./createConfig');
const createLogger = require('./createLogger');
const resolveModule = require('./resolveModule');
const createMongooseConn = require('./createMongooseConn');
const FieldType = require("./FieldType");
const fieldsToSchema = require("./fieldsToSchema");
const password = require("./modules/auth/lib/password");

let app = {};

/**
 *
 * @returns {http.Server}
 */
app.start = function () {

    if(!this._booted) {
        throw new Error('Please run app.boot before app.start');
    }

    let port = process.env.PORT || this.get('config').get('PORT');
    return this.listen(port, () => this.get('log').info(`Listening on port ${port}!`));
};


app.build = function build() {
    this.emit('build');
};

/**
 * 
 * @param {*} str 
 */
app.setDefaultConn = function setDefaultConn(str) {
    this._mongoDefaultConn = str;
};

/**
 *
 * @param options
 * @return {*}
 */
app.boot = function boot(options) {

    this._booted = false;
    this._mongo_connections = {};
    this._mongoDefaultConn = null; // TODO move this to req.locals
    this._mongoConfig = {};
    this._modules = [];

    // build skeletons
    let config = createConfig(options);
    let logger = createLogger(config.get('DEBUG'));
    this.set('log', logger);

    this._mongoDefaultConn = config.get('MONGODB_NAME')  || '_default';
    this._mongoConfig[this._mongoDefaultConn] = {
        protocol: config.get('MONGODB_PROTOCOL'),
        host: config.get('MONGODB_HOST'),
        port: config.get('MONGODB_PORT'),
        user: config.get('MONGODB_USER'),
        pass: config.get('MONGODB_PASS')
    };

    // init modules
    let modules = config.get('modules');
    this._modules = modules.map(m => {
        let modulePath = resolveModule(m, config.get('ROOT_DIR'));
        let ModulesClass = require(modulePath.resolvedPath);
        let moduleInstance = new ModulesClass(this);
        moduleInstance._modulePath = modulePath.resolvedPath;

        // register db schema
        let db = this.getDB();
        if(typeof moduleInstance.registerSchema == 'function') {
            moduleInstance.registerSchema(db);            
        }

        // register config
        if(typeof moduleInstance.config == 'function') {
            config.registerConfig(moduleInstance.config())
        }

        return moduleInstance;
    });

    this.set('config', config);

    // build http schema
    this.use(cors({
        'origin': '*',
        'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
        'exposedHeaders': 'Content-Range,X-Content-Range'
    }));

    this.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    this.use(bodyParser.json({limit: '50mb'}));
    this.use(cookieParser());

    this.use(expressValidator({
        errorFormatter: (param, msg) => {
            return msg;
        }
    }));

    this.emit('boot');

    this.emit('routing');

    this._booted = true;
    return app;
};

/**
 *
 * @param name
 */
app.model = function model(name) {
    return this.getDB().model(name);
};


/**
 *
 * @param dbName
 * @return {*}
 */
app.getDB = function getDB(dbName) {

    dbName = dbName || this._mongoDefaultConn;
    let {
        protocol,
        host,
        port,
        user,
        pass
    } = this._mongoConfig[dbName];

    if(!this._mongo_connections[dbName]) {
        this._mongo_connections[dbName] = createMongooseConn(this, protocol, dbName, host, user, pass, port);
    }

    return this._mongo_connections[dbName];
};

app.install = function install(email, password) {

    let m = this.model("ContentType");

    return m.deleteMany({
        $or: [
            {slug: "users"},
            {slug: "groups"},
            {slug: "permissions"},
        ]
    }).then(r => {

        return createPermission(m)
            .then(r => {
                return createGroup(m);
            }).then(r => {
                return createUser(m, email, password, this);
            }).then(r => {
                console.log("SUCCESS");
                console.log(r)
            }).catch(e => {
                console.error(e)
            })

    });
};

function createPermission(m) {
    console.log("CREATE PERMISSION")
    return m.createContentType("Permission", "permissions", "", [
        {
            type_id: FieldType.SHORT_TEXT,
            name: "name",
            label: "Name",
            validation_rules: "required"
        },
        {
            type_id: FieldType.LONG_TEXT,
            name: "description",
            label: "Description",
            validation_rules: ""
        },
    ])
}


function createGroup(m) {
    return  m.createContentType("Group", "groups", "", [
        {
            type_id: FieldType.SHORT_TEXT,
            name: "name",
            label: "Name",
            validation_rules: "required"
        },
        {
            type_id: FieldType.LONG_TEXT,
            name: "description",
            label: "Description",
            validation_rules: ""
        },
        {
            type_id: FieldType.RELATION_TO_MANY,
            related_content_type_slug: "permissions",
            name: "permissions",
            label: "Permissions",
            validation_rules: "",
            show_in_list: false
        }
    ]);
}

function createUser(m, email, passwordStr, app) {

    let userCollectionSlug = 'users';

    return m.createContentType("User", "users", "", [
        {
            type_id: FieldType.SHORT_TEXT,
            name: 'name',
            label: "Name",
            validation_rules: "required"
        },
        {
            type_id: FieldType.SHORT_TEXT,
            name: 'email',
            label: "Email",
            validation_rules: "required",
            unique: true
        },
        {
            type_id: FieldType.SHORT_TEXT,
            name: 'password',
            label: "Password",
            validation_rules: "required",
            show_in_list: false,
            show_in_form: false
        },
        {
            type_id: FieldType.RELATION_TO_MANY,
            related_content_type_slug: "groups",
            name: "groups",
            label: "Groups",
            validation_rules: "",
            show_in_list: false
        }
    ])
        .then(r => {

            return m.getContentType(userCollectionSlug);

        })
        .then(contentType => {

            let schemaObj = fieldsToSchema.getSchema(contentType.fields);

            let userModel;
            try {
                userModel = app.getDB().model(userCollectionSlug);
            } catch (error) {
                userModel = app.getDB().model(userCollectionSlug, schemaObj, userCollectionSlug);
            }

            return password.hash(passwordStr)
                .then(hashedPassword=> {
                    return userModel.create({
                        email: email,
                        password: hashedPassword
                    }).then(r => {
                        console.log(r)
                    })
            })
        });



    // TODO insert users
    // $2a$05$DiMFhbLVo675diOW3TT9xuIW1N8tNiIP4rW6y5500QaaF5sIBq8XG
}

module.exports = app;