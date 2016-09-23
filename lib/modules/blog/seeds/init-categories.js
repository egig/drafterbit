'use strict';

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('categories').del().then(function () {
    return Promise.all([
    // Inserts seed entries
    knex('categories').insert({ id: 1, label: 'Test Category 1', slug: 'test-category-1' }), knex('categories').insert({ id: 2, label: 'Test Category 2', slug: 'test-category-2' }), knex('categories').insert({ id: 3, label: 'Test Category 3', slug: 'test-category-3', parent_id: 1 })]);
  });
};