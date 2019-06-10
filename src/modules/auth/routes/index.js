const express = require('express');
const api_key = require('./api_key');

let router = express.Router();
router.use(api_key);

module.exports = router;