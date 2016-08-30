
exports.up = function(knex, Promise) {
  return knex.schema.createTable('categories', function (table) {
      table.increments();
      table.string('label');
      table.string('slug');
      table.string('descriptiion');
      table.integer('parent_id');
    })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('categories')
};
