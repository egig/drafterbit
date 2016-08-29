
exports.up = function(knex, Promise) {
  return knex.schema.createTable('pages', function (table) {
      table.increments();
      table.string('title');
      table.string('slug');
      table.string('layout');
      table.text('content');
      table.boolean('status');
      table.timestamps();
    })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('pages');
};
