exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('friends').insert([
    {request_from: 1, request_to: 2, accepted:false},
    {request_from: 2, request_to: 3, accepted:true},
    {request_from: 3, request_to: 4, accepted:true},
    {request_from: 3, request_to: 1, accepted:true},
    {request_from: 4, request_to: 1, accepted:false}
  ]);
};
