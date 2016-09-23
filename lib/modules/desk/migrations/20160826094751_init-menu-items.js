'use strict';

exports.up = function (knex, Promise) {
  return knex.schema.createTable('menu_items', function (table) {
    table.increments();
    table.integer('menu_id');
    table.integer('parent_id');
    table.string('display_text');
    table.string('link');
    table.integer('sequence');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('menu_items');
};