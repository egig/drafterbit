var express = require('express');
var router  = express.Router();

router.get('/desk', function(req, res) {
    res.render('@desk/index.html');
});

module.exports = router;
