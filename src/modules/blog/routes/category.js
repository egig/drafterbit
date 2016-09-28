var express = require('express');
var router = express.Router();

router.get('/', function(req, res){

    res.render('@blog/category/index.html');
});


router.get('/data', function(req, res){
  var knex = req.app.get('knex');

  knex('categories').select('*').then(function(categories){


      var content = {
          recordsTotal: categories.length,
          recordsFiltered: categories.length,
          data: categories
      }

      res.json(content);

  });
})

router.post('/data', function(req, res){

  if(req.body.delete) {
    req.app.model('@blog/category').delete(req.body.categories)
      .then(function(){
        res.json({
          status: 'success',
          message: 'Categories deleted.',
        });
      });
  }

});

router.get('/edit/:id', function(req, res){
  let id = req.params.id;
  if('new' == id) {
    let viewData = {
      category: {
        id: id,
        label: '',
        slug: '',
        description: ''
      }
    }
    res.render('@blog/category/edit.html', viewData);

  } else {
    let cM = req.app.model('@blog/category');
    cM.getOneById(req.params.id).then(function(category){
      let viewData = {
        category: category
      }

      res.render('@blog/category/edit.html', viewData);
    })
  }
})

router.post('/save', function(req, res){

  // validation
  req.checkBody('category[label]', 'Label should not be empty').notEmpty();
  req.checkBody('category[slug]', 'Slug should not be empty').notEmpty();

  var errors = req.validationErrors();
  if(errors) {
      var responseBody = {
        errorType: 'validation',
        errors: errors
      }
      res.json(responseBody, 400);
      return;
  }

  let postData = req.body.category;

  let cM = req.app.model('@blog/category');

  if('new' === postData.id) {
    let insertData = {
      label: postData.label,
      slug: postData.slug,
      description: postData.description,
    }

    cM.insert(insertData).then(function(a){
        let response =  {
          id: a[0],
          status: 'success',
          message: "Category saved"
        }

        res.json(response);
    });
  } else {
    let updateData  = {
      label: postData.label,
      slug: postData.slug,
      description: postData.description,
    }

    cM.update(postData.id, updateData).then(function(a){
        let response =  {
          id: postData.id,
          status: 'success',
          message: "Category saved"
        }

        res.json(response);
    });
  }

});

module.exports = router;
