const db = require("../../data/dbconfig");

module.exports = {
  findUserByName,
  findUsers,
  getFriends,
  findUserEvents,
  findRequest,
  addRequest,
  acceptRequest,
  remove
}

function findUserByName(username) {
  return db('users')
    .where({username})
    .first()
}

function findUsers() {
  return db('users').select('users.username');
}

function findUserEvents(id) {
  return db('event_guests as eg')
    .whereRaw(`eg.user_id == ${id}`)
    .join('events as e', 'e.id','eg.event_id')
    .join('users as u', 'u.id', 'e.user_id')
    .select('e.id', 'e.title', 'e.user_id', 
      'u.username as created_by', 'u.first_name', 'u.last_name',
      'e.description', 'e.points', 'eg.attended', 'e.date'
      )
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
    .select('users.username as request_from', 'users.first_name as rf_fn' ,'users.last_name as rf_ln')
    .join('users as u', 'u.id', 'friends.request_to')
    .select('u.username as request_to', 'friends.accepted', 'u.first_name as rt_fn' ,'u.last_name as rt_ln');
}

function addRequest(req) {
  return db('friends').insert(req)
}

function acceptRequest(req) {
  return db('friends')
    .update({accepted: true})
    .where({request_to: req.request_to})
    .where({request_from: req.request_from})
}

function remove(req) {
  return db('friends')
    .delete()
    .where({request_to: req.request_to})
    .where({request_from: req.request_from})
}