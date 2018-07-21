
exports.up = function(knex, Promise) {

	// CREATE TABLE projects
	// (
	// 	id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	// 	name VARCHAR(255),
	// 	create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
	// 	update_time DATETIME,
	// 	description VARCHAR(255)
	// );

	return knex.schema.createTable('projects', function (table) {
		table.increments();
		table.string('name');
		table.string('description');
		table.timestamps();
	})

};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('projects')
};
