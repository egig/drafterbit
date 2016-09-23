'use strict';

exports.up = function (knex, Promise) {
  return knex.schema.createTable('panels', function (table) {
    table.increments();
    table.string('title');
    table.string('position');
    table.integer('sequence');
    table.string('type');
    table.text('context');
    table.integer('dashboard_id');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('panels');
};