
exports.up = function(knex, Promise) {
  return knex.schema.createTable('dashboards', function (table) {
      table.increments();
      table.string('name');
      table.integer('user_id');
      table.boolean('status');
      table.timestamps();
    })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('dashboards')
};
