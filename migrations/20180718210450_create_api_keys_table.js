
exports.up = function(knex, Promise) {


	// CREATE TABLE api_keys
	// (
	// 	id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	// 	name VARCHAR(255) NOT NULL,
	// 	`key` VARCHAR(255) NOT NULL,
	// 	restriction_type INT(11) COMMENT '0: None
	// 1: HTTP Referer
	// 2. IP Address
	// 3. Android
	// 4. iOS',
	// restriction_value VARCHAR(255),
	// 	project_id INT(11)
	// );
	// CREATE UNIQUE INDEX api_keys_key_uindex ON api_keys (`key`);

	return knex.schema.createTable('api_keys', function (table) {
		table.increments();
		table.string('name');
		table.string('key');
		table.integer('restriction_type');
		table.string('restriction_value');
		table.integer('project_id');
		table.timestamps();
		table.unique('key', 'api_keys_key_uindex')
	})

};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('api_keys');

};
