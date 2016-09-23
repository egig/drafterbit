'use strict';

exports.up = function (knex, Promise) {
  return knex.schema.createTable('comments', function (table) {
    table.increments();
    table.string('author_name');
    table.string('author_email');
    table.string('author_url');
    table.string('content');
    table.integer('post_id');
    table.integer('parent_id');
    table.timestamps();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('comments');
};