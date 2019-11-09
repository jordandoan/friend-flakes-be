
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('events').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('events').insert([
        {title: 'Friendsgiving', date:'10/29/19', points: 5, user_id: 5},
        {title: 'Halloween', date:'10/29/19', points: 5, user_id: 4},
      ]);
    });
};