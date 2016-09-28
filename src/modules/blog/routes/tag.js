var express = require('express');
var router = express.Router();

router.get('/', function(req, res){

    res.render('@blog/tag/index.html');
});


router.get('/data', function(req, res){

  let tM = req.app.model('@blog/tag');
  tM.getAll().then(function(tags){

      var content = {
          recordsTotal: tags.length,
          recordsFiltered: tags.length,
          data: tags
      }

      res.json(content);

  });
})

router.post('/data', function(req, res){

  if(req.body.delete) {
    req.app.model('@blog/tag').delete(req.body.tags)
      .then(function(){
        res.json({
          status: 'success',
          message: 'Tags deleted.',
        });
      });
  }
});

router.get('/edit/:id', function(req, res){
  let id = req.params.id;
  if('new' == id) {
    let viewData = {
      tag: {
        id: id,
        label: '',
        slug: '',
        description: ''
      }
    }
    res.render('@blog/tag/edit.html', viewData);

  } else {
    let tM = req.app.model('@blog/tag');
    tM.getOneById(req.params.id).then(function(tag){
      let viewData = {
        tag: tag
      }

      res.render('@blog/tag/edit.html', viewData);
    })
  }
})

router.post('/save', function(req, res){

  // validation
  req.checkBody('tag[label]', 'Label should not be empty').notEmpty();
  req.checkBody('tag[slug]', 'Slug should not be empty').notEmpty();

  var errors = req.validationErrors();
  if(errors) {
      var responseBody = {
        errorType: 'validation',
        errors: errors
      }
      res.json(responseBody, 400);
      return;
  }

  let postData = req.body.tag;

  let tM = req.app.model('@blog/tag');

  if('new' === postData.id) {
    let insertData = {
      label: postData.label,
      slug: postData.slug,
      description: postData.description,
    }

    tM.insert(insertData).then(function(a){
        let response =  {
          id: a[0],
          status: 'success',
          message: "Tag saved"
        }

        res.json(response);
    });
  } else {
    let updateData  = {
      label: postData.label,
      slug: postData.slug,
      description: postData.description,
    }

    tM.update(postData.id, updateData).then(function(a){
        let response =  {
          id: postData.id,
          status: 'success',
          message: "Tag saved"
        }

        res.json(response);
    });
  }

});

module.exports = router;
