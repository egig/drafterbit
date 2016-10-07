import Model from '../../../model';

class TagModel extends Model {

  insertIfNotExists(tagLabels) {

    let _this = this;
    let tagPromises = [];
    for(let i=0;i<tagLabels.length;i++) {

      tagPromises.push(
        this.knex('tags').first().where('label', tagLabels[i])
          .then(function(tag) {
              if(tag) {
                return tag.id // return id
              }

              return _this.knex('tags').insert({
                label: tagLabels[i]
              }).then(function(a) {
                return a[0]; // return inserted id
              })
          })
      );

    }
    return this.knex.Promise.all(tagPromises);
  }

  getOneByLabel(label){
    return this.knex('tags').first().where('label', label);
  }

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
