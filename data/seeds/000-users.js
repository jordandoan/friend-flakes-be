
const bcrypt = require("bcryptjs");
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username:"testuser", password:bcrypt.hashSync("pass", 12), first_name: "Jordan"},
        {username:"testuser2", password:bcrypt.hashSync("pass", 12), first_name: "Jordan"},
        {username:"testuser3", password:bcrypt.hashSync("pass", 12), first_name: "Jordan"},
        {username:"testuser4", password:bcrypt.hashSync("pass", 12), first_name: "Jordan"},
      ]);
    });
};