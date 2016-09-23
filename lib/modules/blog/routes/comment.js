'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {

    res.render('@blog/comment/index.html');
});

router.get('/data', function (req, res) {
    var knex = req.app.get('knex');

    knex('comments').select('*').then(function (comments) {

        var content = {
            recordsTotal: comments.length,
            recordsFiltered: comments.length,
            data: comments
        };

        res.json(content);
    });
});

module.exports = router;