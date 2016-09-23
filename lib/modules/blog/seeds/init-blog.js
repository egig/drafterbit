'use strict';

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('posts').del().then(function () {
    return Promise.all([
    // Inserts seed entries
    knex('posts').insert({ id: 1, author_id: 1, slug: 'sample-post1', title: 'Sample Post 1', content: 'Test content 1' }), knex('posts').insert({ id: 2, author_id: 1, slug: 'sample-post2', title: 'Sample Post 2', content: 'Test content 2' }), knex('posts').insert({ id: 3, author_id: 1, slug: 'sample-post3', title: 'Sample Post 3', content: 'Test content 3' })]);
  });
};