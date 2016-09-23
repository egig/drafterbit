'use strict';

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('dashboards').del().then(function () {
    return Promise.all([
    // Inserts seed entries
    knex('dashboards').insert({ id: 1, user_id: 1, name: 'Default', status: 1 })]);
  });
};