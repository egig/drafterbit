import Model from '../../../model';

class TagModel extends Model {
  getOneById(id){
    return this.knex('tags').first().where('id', id);
  }

  getAll() {
    return this.knex('tags').select('*');
  }

  insert(t) {
    return this.knex('tags').insert(t);
  }

  update(id, t) {
    return this.knex('tags').where('id', id).update(t);
  }

  delete(ids) {
    return this.knex('tags').whereIn('id', ids).delete();
  }
}

export default TagModel;
