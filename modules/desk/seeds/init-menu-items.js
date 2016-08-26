
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('menu_items').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('menu_items').insert({id: 1, menu_id: 1, parent_id: null, display_text: 'Menu Item 1', sequence: 1, link: '/about'}),
        knex('menu_items').insert({id: 2, menu_id: 1, parent_id: null, display_text: 'Menu Item 2', sequence: 1, link: '/sample-page'}),
        knex('menu_items').insert({id: 3, menu_id: 2, parent_id: null, display_text: 'Menu Item 3', sequence: 1, link: '/about'})
      ]);
    });
};
