var express = require('express');
var router  = express.Router();
const moment = require('moment');

router.get('/page', function(req, res) {
  res.render('@page/index.html');

});

router.get('/page/data', function(req, res) {

  var knex = req.app.get('knex');

  knex('pages').select('*').then(function(pages){
      var content = {
          recordsTotal: pages.length,
          recordsFiltered: pages.length,
          data: pages
      }

      res.json(content);
  });

});


router.post('/page/data', function(req, res){

  // @todo CSRF protect

  if(req.body.delete) {
    let pM = req.app.model('@page/page');

    pM.delete(req.body.pages).then(function(){
      res.json({
        status: 'success',
        message: 'Pages deleted',
      })
    })
  }
});

router.get('/page/edit/:id', function(req, res) {

  if(req.params.id === 'new') {
    let page = {
      id: req.params.id,
      title: '',
      slug: '',
      content: '',
    }
    let viewData = {
      page: page
    }

    res.render('@page/edit.html', viewData);
  } else {
    let pM = req.app.model('@page/page');
    pM.getOneById(req.params.id).then(function(page){

      let viewData = {
        page: page
      }

      res.render('@page/edit.html', viewData);
    });
  }

});

router.post('/page/save', function(req, res) {

  req.checkBody('page[title]', 'Title should not be empty').notEmpty();
  req.checkBody('page[slug]', 'Slug should not be empty').notEmpty();

  var errors = req.validationErrors();
  if(errors) {
      var responseBody = {
        errorType: 'validation',
        errors: errors
      }
      res.json(responseBody, 400);
      return;
  }

  let postData = req.body.page;

  let pM = req.app.model('@page/page');

  if(postData.id === 'new') {

    let insertData = {
      title: postData.title,
      slug: postData.slug,
      content: postData.content,
      layout: postData.layout,
      published_at: postData.published_at,
      created_at: moment().format('YYYY-MM-D hh:mm:ss'),
      updated_at: moment().format('YYYY-MM-D hh:mm:ss'),
      author_id: req.user.id,
    }

    pM.insert(insertData).then(function(a){
      let response = {
        id: a[0],
        status: 'success',
        message: 'Page saved',
      }

      res.json(response)
    })

  } else {

    let updateData = {
      title: postData.title,
      slug: postData.slug,
      content: postData.content,
      layout: postData.layout,
      published_at: postData.published_at,
      updated_at: moment().format('YYYY-MM-D hh:mm:ss'),
    }

    pM.update(postData.id, updateData).then(function(a){
      let response = {
        id: postData.id,
        status: 'success',
        message: 'Page updated',
      }

      res.json(response)
    })

  }

});

router.get('/:slug?', function(req, res, next) {

  var frontpage = 'sample-page1'; // @todo get fronrpage from db
  var slug = req.params.slug || frontpage;

  var knex = req.app.get('knex');
  knex('pages').first().where('slug', slug).then(function(page){

    if(!page) {
      return res.render('@theme/404.html')
    }
    res.render('@theme/content/page/view.html', {page: page});

  }).catch(function(e){
     next(e);
  });

});

module.exports = router;
