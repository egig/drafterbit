import Model from '../../../model';

class PostModel extends Model {

  getAll(callback) {
    var _this = this;
    this.knex('posts').select('*').then(function(posts){

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

      _this.knex.Promise.all(pmss).then(function(posts){
        callback(null, posts);
      });
    });
  }

  getOneById(id){
    return this.knex('posts').first().where('id', id);
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
}

export default PostModel;
