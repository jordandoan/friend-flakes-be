
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('event_guests').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('events_guests').insert([
        {event_id: 2, user_id: 2, attended: true}
      ]);
    });
};
