'use strict';

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('groups').del().then(function () {
    return Promise.all([knex('groups').insert({
      id: 1, //@todo reference this in user group
      name: 'Administrator',
      description: 'Boss of the site',
      permissions: '[]'
    }), knex('groups').insert({
      id: 2, //@todo reference this in user group
      name: 'User',
      description: 'Just user',
      permissions: '[]'
    })]);
  });
};