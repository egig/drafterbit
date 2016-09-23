'use strict';

exports.up = function (knex, Promise) {
  return knex.schema.createTable('users_groups', function (table) {
    table.increments();
    table.integer('user_id');
    table.integer('group_id');
    table.timestamps();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('users_groups');
};