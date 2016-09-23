'use strict';

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('posts_categories').del().then(function () {
    return Promise.all([
    // Inserts seed entries
    knex('posts_categories').insert({ id: 1, post_id: 1, category_id: 1 }), knex('posts_categories').insert({ id: 2, post_id: 1, category_id: 2 }), knex('posts_categories').insert({ id: 3, post_id: 1, category_id: 3 })]);
  });
};