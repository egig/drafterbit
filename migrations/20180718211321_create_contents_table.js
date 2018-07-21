
exports.up = function(knex, Promise) {

	// CREATE TABLE contents
	// (
	// 	id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	// 	content_type_id INT(11),
	// 	content_values TEXT
	// );

	return knex.schema.createTable('contents', function (table) {
		table.increments();
		table.integer('content_type_id');
		table.integer('content_values');
	})

};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('contents');
};
