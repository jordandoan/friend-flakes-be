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
    .where({request_from: id})
    .orWhere({request_to: id})
    .join('users', 'users.id', 'friends.request_from')
    .select('users.username as request_by')
    .join('users as u', 'u.id', 'friends.request_to')
    .select('u.username as request_to', 'friends.accepted');
}
