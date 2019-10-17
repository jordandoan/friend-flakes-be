const db = require("../../data/dbconfig");

module.exports = {
  findUserByName,
  findUsers,
  getFriends,
  findRequest,
  addRequest
}

function findUserByName(username) {
  return db('users')
    .where({username: username})
    .first()
}

function findUsers() {
  return db('users').select('users.username');
}

function findRequest(req) {
  return db('friends')
    .where({request_from: req.request_from})
    .where({request_to: req.request_to})
    .first()
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

function addRequest(req) {
  return db('friends').insert(req)
}