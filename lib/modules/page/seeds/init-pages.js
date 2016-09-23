'use strict';

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('pages').del().then(function () {
    return Promise.all([
    // Inserts seed entries
    knex('pages').insert({ id: 1, slug: 'sample-page1', title: 'Sample Page 1', content: 'Test Page Content 1', status: 1, layout: 'default' }), knex('pages').insert({ id: 2, slug: 'sample-page2', title: 'Sample Page 2', content: 'Test Page Content 2', status: 1, layout: 'default' }), knex('pages').insert({ id: 3, slug: 'sample-page3', title: 'Sample Page 3', content: 'Test Page Content 3', status: 1, layout: 'default' })]);
  });
};