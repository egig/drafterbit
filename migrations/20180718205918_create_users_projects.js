
exports.up = function(knex, Promise) {

	// CREATE TABLE users_projects
	// (
	// 	user_id INT(11),
	// 	project_id INT(11),
	// 	role INT(11)
	// );

	return knex.schema.createTable('users_projects', function (table) {
		table.increments();
		table.integer('user_id').unsigned().notNullable();
		table.integer('project_id').unsigned().notNullable();
		table.integer('role');
	})

};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('users_projects')
};
