'use strict';

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('menus').del().then(function () {
    return Promise.all([
    // Inserts seed entries
    knex('menus').insert({ id: 1, name: 'main' }), knex('menus').insert({ id: 2, name: 'second' })]);
  });
};