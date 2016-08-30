
exports.up = function(knex, Promise) {
  return knex.schema.createTable('tags', function (table) {
      table.increments();
      table.string('label');
      table.string('slug');
      table.string('descriptiion');
    })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('tags')
};
