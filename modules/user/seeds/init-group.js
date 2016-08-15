
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('groups').del()
    .then(function () {
      return Promise.all([
        knex('groups').insert(
          {
            id: 1, //@todo reference this in user group
            name: 'Administrator',
            description: 'Boss of the site',
            permissions: '[]',
          }),
      ]);
    });
};
