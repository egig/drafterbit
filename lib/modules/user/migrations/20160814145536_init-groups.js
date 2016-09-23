'use strict';

exports.up = function (knex, Promise) {
  return knex.schema.createTable('groups', function (table) {
    table.increments();
    table.string('name');
    table.string('description');
    table.string('permissions');
    table.timestamps();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('groups');
};