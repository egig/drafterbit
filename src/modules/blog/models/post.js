import Model from '../../../model';

class PostModel extends Model {

  setCategories(postId, categories) {
    let _this = this;
    return this.knex('posts_categories').where('post_id', postId).delete().then(function(){
      let q=[];
      for (let i = 0; i < categories.length; i++) {
        q.push(_this.knex('posts_categories').insert({post_id: postId, category_id: categories[i] }))
      }
      return _this.knex.Promise.all(q);
    })
  }

  setTags(postId, tagIds) {
    let _this = this;
    return this.knex('posts_tags').where('post_id', postId).delete().then(function(){
      let q=[];
      for (let i = 0; i < tagIds.length; i++) {
        q.push(_this.knex('posts_tags').insert({post_id: postId, tag_id: tagIds[i] }))
      }
      return _this.knex.Promise.all(q);
    })
  }

  getAll() {
    var _this = this;
    return this.knex('posts').select('*').then(function(posts){

      if(!posts) {
        return callback(null, []);
      }

      let pmss = [];
      for(let i=0; i<posts.length;i++) {

        let p = posts[i];

        pmss.push(_this.knex('users').first().where('id', p.author_id).then(function(u){
          p.author = u;
          return p;
        }));
      }

      return _this.knex.Promise.all(pmss);
    });
  }

  getOneById(id){
    let _this = this;
    return this.knex('posts').first().where('id', id).then(function(post){
      return _this.knex('posts_categories').where('post_id', id).select('*').then(function(pc){

        let categoryIds = [];
        for(let i=0; i<pc.length; i++) {
          categoryIds.push(pc[i].category_id);
        }

        post.categoryIds = categoryIds;

        return _this.knex('posts_tags').where('post_id', id).then(function(pt){

          let tagIds = [];
          for(let i=0; i<pt.length; i++) {
            tagIds.push(pt[i].tag_id);
          }

          return _this.knex('tags').whereIn('id', tagIds).then(function(tags){

            post.tags = tags;
            return _this.knex.Promise.resolve(post);
          });
        });
      })
    });
  }

  insert(p) {
    return this.knex('posts').insert(p);
  }

  update(id, p, callback) {
    var _this = this;
    this.knex('posts').where('id', id).update(p).then(function() {
      callback();
    });
  }

  delete(ids){
    let _this = this;
    return this.knex('posts_tags').whereIn('post_id', ids).delete().then(function() {
      return _this.knex('posts_categories').whereIn('post_id', ids).delete().then(function(){
        return _this.knex('posts').whereIn('id', ids).delete();
      });
    });
  }

}

export default PostModel;
