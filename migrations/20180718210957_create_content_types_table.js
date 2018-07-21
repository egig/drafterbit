
exports.up = function(knex, Promise) {

	// CREATE TABLE content_types
	// (
	// 	id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	// 	name VARCHAR(255),
	// 	description VARCHAR(255) NOT NULL,
	// 	project_id INT(11),
	// 	create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
	// 	update_time DATETIME,
	// 	slug VARCHAR(255)
	// );

	return knex.schema.createTable('content_types', function (table) {
		table.increments();
		table.string('name');
		table.string('slug');
		table.string('description');
		table.integer('project_id');
		table.timestamps();
	})

};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('content_types');

};
