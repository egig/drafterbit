'use strict';

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('panels').del().then(function () {
    return Promise.all([
    // Inserts seed entries
    knex('panels').insert({
      id: 1,
      title: 'Welcome',
      position: 'left',
      sequence: 0,
      type: 'TextPanel',
      context: '{"content": "Welcome !"}',
      dashboard_id: 1
    }), knex('panels').insert({
      id: 2,
      title: 'Text',
      position: 'right',
      sequence: 0,
      type: 'TextPanel',
      context: '{"content": "Text Panel"}',
      dashboard_id: 1
    })]);
  });
};