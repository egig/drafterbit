'use strict';

exports.up = function (knex, Promise) {
  return knex.schema.createTable('posts', function (table) {
    table.increments();
    table.string('title');
    table.string('slug');
    table.integer('author_id');
    table.text('content');
    table.boolean('status');
    table.timestamps();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('posts');
};