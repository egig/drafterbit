'use strict';

exports.up = function (knex, Promise) {
  return knex.schema.createTable('posts_tags', function (table) {
    table.increments();
    table.integer('post_id');
    table.integer('tag_id');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('posts_tags');
};