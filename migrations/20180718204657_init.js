
exports.up = function(knex, Promise) {

	// CREATE TABLE users
	// (
	// 	id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	// 	email VARCHAR(45) NOT NULL,
	// 	password VARCHAR(255) NOT NULL,
	// 	first_name VARCHAR(45) NOT NULL,
	// 	last_name VARCHAR(45),
	// 	create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
	// 	update_time DATETIME
	// );
	// CREATE UNIQUE INDEX users_email_uindex ON users (email);

	return knex.schema.createTable('users', function (table) {
		table.increments();
		table.string('email');
		table.string('password');
		table.string('first_name');
		table.string('last_name');
		table.timestamps();
	})

};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('users')
};
