import express from 'express';
import moment from 'moment';

const router = express.Router();

router.get('/', function(req, res){
    res.render('@blog/post/index.html');
});


router.get('/data', function(req, res){

  req.app.model('@blog/post').getAll().then(function(posts){

      var content = {
          recordsTotal: posts.length,
          recordsFiltered: posts.length,
          data: posts
      }

      res.json(content);

  });
});

router.get('/edit/:id', function(req, res){

  if(req.params.id !== 'new') {
    let pM = req.app.model('@blog/post');
    pM.getOneById(req.params.id).then(function(p){

      let viewData = {
        post: p,
        tags: '[]',
        tag_options: "['Test']",
      }

      res.render('@blog/post/edit.html', viewData);

    })
  } else {

    let post = {
      id: req.params.id,
      title: '',
      slug: '',
      content: '',
      published_at: moment().format('YYYY-MM-D hh:mm:ss')
    }

    let viewData = {
      post: post,
      tags: '[]',
      tag_options: "['Test']",
    }

    res.render('@blog/post/edit.html', viewData);
  }
});

router.post('/save', function(req, res){

  let postData = req.body.post;
  let pM = req.app.model('@blog/post');

  if(postData.id == 'new') {

    let insertData = {
      title: postData.title,
      content: postData.content,
      slug: postData.slug,
      published_at: postData.published_at,
      created_at: moment().format('YYYY-MM-D hh:mm:ss'),
      updated_at: moment().format('YYYY-MM-D hh:mm:ss'),
    }

    pM.insert(insertData).then(function(a){

      let response = {
        id: a[0],
        message: "Post saved",
        status: "success",
      }

      res.json(response);
    })
  } else {
    let updateData = {
      title: postData.title,
      content: postData.content,
      slug: postData.slug,
      published_at: postData.published_at,
      updated_at: moment().format('YYYY-MM-D hh:mm:ss'),
    }

    pM.update(postData.id, updateData, function(err){

      let response = {
        id: postData.id,
        message: "Post updated",
        status: "success",
      }

      res.json(response);
    })
  }

});

module.exports = router;
