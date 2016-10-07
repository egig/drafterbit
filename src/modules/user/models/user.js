import Model from '../../../model';

class UserModel extends Model {
  getAll() {
    return this.knex('users').select('*');
  }
}

export default UserModel;
