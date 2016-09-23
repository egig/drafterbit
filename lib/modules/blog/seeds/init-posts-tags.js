'use strict';

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('posts_tags').del().then(function () {
    return Promise.all([
    // Inserts seed entries
    knex('posts_tags').insert({ id: 1, post_id: 1, tag_id: 1 }), knex('posts_tags').insert({ id: 2, post_id: 1, tag_id: 2 }), knex('posts_tags').insert({ id: 3, post_id: 1, tag_id: 2 })]);
  });
};