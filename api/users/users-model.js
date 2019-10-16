const db = require("../../data/dbconfig");

module.exports = {
  findUsers,
  getFriends
}

function findUsers() {
  return db('users').select('users.username');
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
