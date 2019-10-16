const db = require("../../data/dbconfig");

module.exports = {
  register,
  findUsers,
  findUser
}

function register(user) {
  return db('users').insert(user)
    .then(id => {return {id:id[0]}});
}

function findUsers() {
  return db('users').select('users.username');
}

function findUser(username) {
  return db('users').where({username: username})
    .then(users => users[0])
}

function getFriends(id) {
  return db('friends')
    .where({first: id})
    .orWhere({second: id})
    .innerjoin('users', 'users.id', 'friends.first')
    .select('users.username as requester')
    .join('users as u', 'u.id', 'friends.second')
    .select('u.username as requested');
}
