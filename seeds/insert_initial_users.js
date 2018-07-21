
exports.seed = function(knex, Promise) {

  return knex('users').del()
    .then(function () {
      return knex('users').insert([
        {
        	id: 1,
	        email: 'admin@gmail.com',
	        password: '$2a$05$PlC.ZRoRDF8x7rp.xZurb.I9obNTbh/dlU3d7x/uL5ldOR0TfBJ7O',
	        first_name: "Super",
	        last_name: "Admin",
        },
      ]);
    });
};
