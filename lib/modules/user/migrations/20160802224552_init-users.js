'use strict';

exports.up = function (knex, Promise) {
  return knex.schema.createTable('users', function (table) {
    table.increments();
    table.string('username');
    table.string('realname');
    table.string('email');
    table.string('password');
    table.string('url');
    table.text('bio');
    table.boolean('status');
    table.timestamps();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('users');
};