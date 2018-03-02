import express from 'express';
let router = express.Router();
import password from '../../common/lib/password';
import config from '../../../config';
import axios from 'axios';

router.post('/user/login', function (req, res) {

	(async function () {

		try {
			let response = await axios.post('http://localhost:3003/v1/users/session', req.body);
			let user = response.data;
			req.session.user = user;
			res.send(user);

		} catch (e) {
			res.status(500);
			res.send({
				message: e.message
			})
		}
		
	})();

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

		let doc  = {};
		if(typeof req.body.email !== "undefined") {
			doc.email = req.body.email;
		}

		// TODO clean this
		if(typeof req.body.password !== "undefined") {
			password.hash(req.body.password, (err, hashedPassword) => {
				doc.password = hashedPassword;

				collection.updateOne({name: req.params.name}, {$set: doc}, (err, r) => {

					res.json({
						message: "OK"
					});

				});

			});
		} else {
			collection.updateOne({name: req.params.name}, {$set: doc}, (err, r) => {

				res.json({
					message: "OK"
				});

			});
		}

	});
});

export default router;