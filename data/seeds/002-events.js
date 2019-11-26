
exports.seed = function(knex) {
  // Inserts seed entries
  return knex('events').insert([
    {title: 'Friendsgiving', date: new Date('10/29/19'), points: 5, user_id: 1},
    {title: 'Halloween', date: new Date('10/29/19'), points: 5, user_id: 4},
    {title: 'Friendsgiving2', date: new Date('10/29/19'), points: 5, user_id: 1},
    {title: 'Friendsgiving3', date: new Date('10/29/19'), points: 5, user_id: 1},
    {title: 'Friendsgiving4', date: new Date('10/29/19'), points: 5, user_id: 1},
    {title: 'Friendsgiving5', date: new Date('10/29/19'), points: 5, user_id: 1},
  ]);
};
