import express from 'express';
let router = express.Router();
import password from '../common/lib/password';
import config from '../../config';

const MongoClient = require('mongodb').MongoClient;

router.post('/user/login', function (req, res) {

    let email = req.body.email;
    let rawPassword = req.body.password;

    MongoClient.connect(config.MONGODB_URL, function(err, db) {

        const collection = db.collection('users');
        collection.find({'email': email}).limit(1).next(function(err, doc) {
            db.close();

            if(doc) {
                let hashedPassword = doc.password;
                delete doc.password;

                password.compare(rawPassword, hashedPassword, (err, isMatch) => {
                    if(isMatch) {
                    	  req.session.user = doc;
                        res.json(doc);
                    } else {
                        res.status(403);
                        res.json({
                            message: 'Wrong email or password.'
                        });
                    }

                });

            } else {
                res.status(403);
                res.json({
                    message: 'Wrong email or password.'
                });
            }

        });

    });

});

export default router;