import express from 'express';
let router = express.Router();

router.get('/dummy', function (req, res) {
	res.send('This is dummy page !');
});

export default router;