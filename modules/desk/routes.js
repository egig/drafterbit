var express = require('express');
var router  = express.Router();

router.get('/desk', function(req, res) {

    var knex = req.app.get('knex');

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

module.exports = router;
