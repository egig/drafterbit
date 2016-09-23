'use strict';

exports.up = function (knex, Promise) {
  return knex.schema.createTable('posts_categories', function (table) {
    table.increments();
    table.integer('post_id');
    table.integer('category_id');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('posts_categories');
};