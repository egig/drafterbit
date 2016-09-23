'use strict';

exports.up = function (knex, Promise) {
  return knex.schema.createTable('logs', function (table) {
    table.increments();
    table.string('level');
    table.string('msg');
    table.json('meta');
    table.timestamp('time').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('logs');
};