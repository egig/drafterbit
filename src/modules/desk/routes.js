var express = require('express');
var router  = express.Router();

router.get('/desk', function(req, res) {

    var knex = req.app.get('knex');
    var appLogger = req.app.get('appLogger');
    appLogger.log("info", req.user.realname+" visited dashboard");

    var userId = req.user.id;
    knex('dashboards').first().where({user_id: userId, status: 1})
      .then(function(dashboard){
        knex('panels').select('*').where({dashboard_id: dashboard.id})
          .then(function(panels){

            var leftPanels = [];
            var rightPanels = [];

            for(var i=0;i<panels.length;i++){

               panels[i].view = req.app.get('panelManager').getPanel(panels[i].type).getView();

               if(panels[i].position === 'left') {
                 leftPanels.push(panels[i]);
               }

               if(panels[i].position === 'right') {
                 rightPanels.push(panels[i]);
               }
            }

            res.render('@desk/index.html', {
              leftPanels: leftPanels,
              rightPanels: rightPanels,
            });
          });
      });
});

router.get('/desk/system/log', function(req, res) {
  res.render('@desk/system/log.html');
})

router.get('/desk/system/log/data', function(req, res) {
  var knex = req.app.get('knex');

  knex('logs').select('*').then(function(logs){
      var content = {
          recordsTotal: logs.length,
          recordsFiltered: logs.length,
          data: logs
      }

      res.json(content);

  });
})

router.get('/desk/js/drafterbit.js', function(req, res){

  res.header('Content-type','text/javascript');
  res.render('@desk/drafterbit.js');

});

module.exports = router;
