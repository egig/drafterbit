import bcrypt from  'bcrypt-nodejs';

exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('users').insert(
          {
            id: 1, //@todo reference this in user group
            username: 'admin',
            realname: 'Admin Kece',
            bio: 'Admin Kece',
            url: 'http://drafterbit.org',
            email: 'demo@drafterbit.org',
            password: bcrypt.hashSync('demo'),
            status: 1
          }),
      ]);
    });
};
