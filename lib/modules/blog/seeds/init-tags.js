'use strict';

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('tags').del().then(function () {
    return Promise.all([
    // Inserts seed entries
    knex('tags').insert({ id: 1, slug: 'test-tag-1', label: 'Test Tag 1' }), knex('tags').insert({ id: 2, slug: 'test-tag-2', label: 'Test Tag 2' }), knex('tags').insert({ id: 3, slug: 'test-tag-3', label: 'Test Tag 3' })]);
  });
};