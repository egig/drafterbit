import Model from '../../../model';

class LogModel extends Model {

  clear() {
    return this.knex('logs').delete();
  }
}

export default LogModel;
