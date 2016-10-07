import Model from '../../../model';

class GroupModel extends Model {

  insert(g) {
    return this.knex('groups').insert(g);
  }

  update(id, g) {
    return this.knex('groups').where('id', id).update(g);
  }

  getAll() {
    return this.knex('groups').select('*');
  }
}

export default GroupModel;
