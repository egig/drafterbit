import Model from '../../../model';

class UserModel extends Model {
  getAll(callback) {
    this.knex('users').select('*').then(function(users){
      callback(null, users)
    }).catch(function(e){
      callback(e);
    });
  }
}

export default UserModel;
