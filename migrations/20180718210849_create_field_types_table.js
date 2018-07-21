
exports.up = function(knex, Promise) {

	// CREATE TABLE field_types
	// (
	// 	id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	// 	name VARCHAR(45),
	// 	description VARCHAR(225)
	// );

	return knex.schema.createTable('field_types', function (table) {
		table.increments();
		table.string('name');
		table.string('description');
		table.timestamps();
	})

};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('field_types');

};
