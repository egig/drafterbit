'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {

    res.render('@blog/category/index.html');
});

router.get('/data', function (req, res) {
    var knex = req.app.get('knex');

    knex('categories').select('*').then(function (categories) {

        var content = {
            recordsTotal: categories.length,
            recordsFiltered: categories.length,
            data: categories
        };

        res.json(content);
    });
});

module.exports = router;