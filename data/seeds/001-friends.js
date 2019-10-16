exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('friends').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('friends').insert([
        {request_from: 1, request_to: 2, accepted:true},
        {request_from: 2, request_to: 3, accepted:true},
        {request_from: 3, request_to: 4, accepted:true},
        {request_from: 3, request_to: 1, accepted:true},
      ]);
    });
};
