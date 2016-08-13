
exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('users').insert(
          {
            username: 'admin',
            realname: 'Admin Kece',
            bio: 'Admin Kece',
            url: 'http://drafterbit.org',
            email: 'demo@drafterbit.org',
            password: 'foo',
            status: 1
          }),
      ]);
    });
};
