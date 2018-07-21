
exports.up = function(knex, Promise) {

	// CREATE TABLE content_type_fields
	// (
	// 	id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	// 	content_type_id INT(11),
	// 	name VARCHAR(225),
	// 	label VARCHAR(225),
	// 	field_type_id INT(11) NOT NULL
	// );

	return knex.schema.createTable('content_type_fields', function (table) {
		table.increments();
		table.integer('content_type_id');
		table.string('name');
		table.string('label');
		table.integer('field_type_id');
	})

};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('content_type_fields');

};
