import Model from '../../../model';

class PostModel extends Model {

  getAll() {
    return this.knex('posts').select('*');
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
