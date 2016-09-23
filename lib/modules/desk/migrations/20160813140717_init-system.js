'use strict';

exports.up = function (knex, Promise) {
  return knex.schema.createTable('system', function (table) {
    table.increments();
    table.string('key');
    table.string('val');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('system');
};