
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('system').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('system').insert({id: 1, key: 'appName', val: "Awesome Application"}),
      ]);
    });
};
