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

function _getChilds(parentId, categories) {
  let childs = [];
  for(let i=0; i<categories.length; i++) {
    if (categories[i].parent_id == parentId) {
      childs.push(categories[i]);
    }
  }

  if(childs.length > 0) {
    for(let i=0; i<childs.length; i++) {
      childs[i].childrens = _getChilds(childs[i].id, categories);
    }
  }

  return childs;
}

router.get('/edit/:id', function(req, res){

  let cM = req.app.model('@blog/category');
  let tM = req.app.model('@blog/tag');

  cM.getAll().then(function(categories){

    tM.getAll().then(function(tags) {

      let categoryTree = _getChilds(0, categories);
      let tagOptionArray = [];
      for(let i=0;i<tags.length;i++) {
        tagOptionArray.push('"'+tags[i].label+'"');
      }

      let viewData = {
        tag_options: '['+tagOptionArray.join(',')+']',
        category_options: categoryTree
      }

      if(req.params.id !== 'new') {
        let pM = req.app.model('@blog/post');
        pM.getOneById(req.params.id).then(function(p){

          let tagArray = [];
          for(let i=0;i<p.tags.length;i++) {
            tagArray.push('"'+p.tags[i].label+'"');
          }
          viewData.post= p;
          viewData.tags= '['+tagArray.join(',')+']';

          res.render('@blog/post/edit.html', viewData);
        })

      } else {

        let post = {
          id: req.params.id,
          title: '',
          slug: '',
          content: '',
          published_at: moment().format('YYYY-MM-D hh:mm:ss'),
          categoryIds: [],
        }

        viewData.post= post;
        viewData.tags= '[]';

        res.render('@blog/post/edit.html', viewData);
      }

    });
  })
});

router.post('/save', function(req, res){

  let postData = req.body.post;
  let pM = req.app.model('@blog/post');
  let tM = req.app.model('@blog/tag');

  req.checkBody('post[title]', 'Title should not be empty').notEmpty();
  req.checkBody('post[slug]', 'Slug should not be empty').notEmpty();

  var errors = req.validationErrors();
  if(errors) {
      var responseBody = {
        errorType: 'validation',
        errors: errors
      }
      res.json(responseBody, 400);
      return;
  }

  if(postData.id == 'new') {

    let insertData = {
      title: postData.title,
      content: postData.content,
      slug: postData.slug,
      published_at: postData.published_at,
      created_at: moment().format('YYYY-MM-D hh:mm:ss'),
      updated_at: moment().format('YYYY-MM-D hh:mm:ss'),
      author_id: req.user.id
    }

    pM.insert(insertData).then(function(a){
      pM.setCategories(a[0], postData.categories).then(function(){
        // handle post tags
        tM.insertIfNotExists(postData.tags).then(function(tagIds) {
          pM.setTags(a[0], tagIds).then(function(){

            let response = {
              id: a[0],
              message: "Post saved",
              status: "success",
            }

            res.json(response);
          })

        });
      });
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
      pM.setCategories(postData.id, postData.categories).then(function(){

        tM.insertIfNotExists(postData.tags).then(function(tagIds) {
          pM.setTags(postData.id, tagIds).then(function(){

            let response = {
              id: postData.id,
              message: "Post Updated",
              status: "success",
            }

            res.json(response);
          })

        });

      })
    })
  }

});

module.exports = router;
