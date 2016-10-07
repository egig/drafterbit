import Model from '../../../model';

class CategoryModel extends Model {
  getOneById(id){
    return this.knex('categories').first().where('id', id);
  }

  getAll() {
    return this.knex('categories').select('*');
  }

  insert(c) {
    return this.knex('categories').insert(c);
  }

  update(id, c) {
    return this.knex('categories').where('id', id).update(c);
  }

  delete(ids) {
    return this.knex('categories').whereIn('id', ids).delete();
  }

  getPossibleParents(id) {
    return this.knex('categories').whereNot(
      {id: id, parent_id: id}
    ).select('*');
  }
}

export default CategoryModel;
