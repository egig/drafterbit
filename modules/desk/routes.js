var express = require('express');
var router  = express.Router();

router.get('/desk', function(req, res) {

    var knex = req.app.get('knex');

    var userId = req.user.id;
    knex('dashboards').first().where({user_id: userId, status: 1})
      .then(function(dashboard){
        knex('panels').select('*').where({dashboard_id: dashboard.id})
          .then(function(panels){
            res.render('@desk/index.html', {panels: panels});
          });
      });
});

module.exports = router;
