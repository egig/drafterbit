'use strict';

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('users_groups').del().then(function () {
    return Promise.all([
    // Inserts seed entries
    knex('users_groups').insert({ id: 1, user_id: 1, group_id: 1 })]);
  });
};