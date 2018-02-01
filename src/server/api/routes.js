import express from 'express';
let router = express.Router();
import password from '../../common/lib/password';
import config from '../../../config';

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


router.get('/users', function (req, res) {

	MongoClient.connect(config.MONGODB_URL, (err, db) => {

		const collection = db.collection('users');

		collection.find().project({id:1,name:1,email:1}).toArray((err, docs) => {
			res.json(docs);
		});

	});
	
});

router.post('/users', function (req, res) {

	MongoClient.connect(config.MONGODB_URL, (err, db) => {

		const collection = db.collection('users');

		password.hash(req.body.password, (err, hashedPassword) => {

			let user = {
				name: req.body.name,
				email: req.body.email,
				password: hashedPassword,
			};

			collection.insertOne(user)
				.then(r => {
					res.send({message: "OK"});

				}).catch(e => {
					res.status(500);
					res.send({message: e.message});
			});

		});

	});
	
});

router.delete('/users/:name', (req, res) => {

	MongoClient.connect(config.MONGODB_URL, (err, db) => {

		const collection = db.collection('users');

		collection.deleteOne({name: req.params.name}, (err, r) => {

			res.json({
				message: "OK",
				deleted_count: r.deletedCount
			});

		});

	});
});

router.patch('/users/:name', (req, res) => {

	MongoClient.connect(config.MONGODB_URL, (err, db) => {

		const collection = db.collection('users');

		collection.updateOne({name: req.params.name}, {$set: req.body}, (err, r) => {

			res.json({
				message: "OK"
			});

		});

	});
});

export default router;