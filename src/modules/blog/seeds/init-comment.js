
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('comments').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('comments').insert({id: 1, author_name: 'User 1', author_email: 'user1@mail.com', author_url: "http://google.com", content: 'Test Comment 1', post_id: 1, parent_id: 0}),
        knex('comments').insert({id: 2, author_name: 'User 2', author_email: 'user2@mail.com', author_url: "http://google.com", content: 'Test Comment 2', post_id: 1, parent_id: 0}),
        knex('comments').insert({id: 3, author_name: 'User 3', author_email: 'user3@mail.com', author_url: "http://google.com", content: 'Test Comment 3', post_id: 1, parent_id: 0})
      ]);
    });
};
