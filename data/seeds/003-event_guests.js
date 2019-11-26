
exports.seed = function(knex) {
  // Inserts seed entries
  return knex('event_guests').insert([
    {event_id: 2, user_id: 2, attended: true},
    {event_id: 2, user_id: 4, attended: true},
    {event_id: 1, user_id: 1, attended: true},
    {event_id: 1, user_id: 5, attended: true},
    {event_id: 2, user_id: 1, attended: false},
  ]);
};
