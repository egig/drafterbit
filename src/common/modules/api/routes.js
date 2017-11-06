import express from 'express';
let router = express.Router();

router.post('/login', function (req, res) {
    res.send('login');
});

export default router;