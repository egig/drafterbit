import Model from '../../../model';

class PageModel extends Model {
  getOneById(id){
    return this.knex('pages').first().where('id', id);
  }

  getAll() {
    return this.knex('pages').select('*');
  }

  insert(p) {
    return this.knex('pages').insert(p);
  }

  update(id, p) {
    return this.knex('pages').where('id', id).update(p);
  }

  delete(ids) {
    return this.knex('pages').whereIn('id', ids).delete();
  }
}

export default PageModel;
