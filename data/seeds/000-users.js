
const bcrypt = require("bcryptjs");
exports.seed = function(knex) {
  return knex('users').insert([
    {username:"testuser", password:bcrypt.hashSync("pass", 12), first_name: "Jordan"},
    {username:"testuser2", password:bcrypt.hashSync("pass", 12), first_name: "Jordan2", last_name: "Nugget"},
    {username:"testuser3", password:bcrypt.hashSync("pass", 12), first_name: "Jordan3"},
    {username:"testuser4", password:bcrypt.hashSync("pass", 12), first_name: "Jordan4"},
    {username:"testtest", password: bcrypt.hashSync("password",12), first_name: "Jordan" },
  ]);
};
