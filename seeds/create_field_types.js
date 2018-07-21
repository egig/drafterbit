
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('field_types').del()
    .then(function () {
      // Inserts seed entries
      return knex('field_types').insert([
        {id: 1, name: 'Short Text'},
        {id: 2, name: 'Long Text'},
        {id: 3, name: 'HTML Text'},
        {id: 4, name: 'number'},
        {id: 5, name: 'image'},
        {id: 6, name: 'video'},
        {id: 7, name: 'file'}
      ]);
    });
};
