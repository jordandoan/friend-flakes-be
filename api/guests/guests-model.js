const db = require("../../data/dbconfig");

module.exports = {
  getEventGuests,
  addGuest,
  updateGuest,
  removeGuest,
  findInvite
}

function getEventGuests(event_id) {
  return db('event_guests as eg')
    .where({event_id})
    .join('users as u', 'u.id', 'eg.user_id')
    .select('u.username', 'u.first_name', 'u.last_name', 'eg.attended')
}

function findInvite(event_id, user_id) {
  return db('event_guests')
    .where({event_id})
    .where({user_id})
    .first()
}

function addGuest(guest) {
  return db('event_guests')
    .insert(guest)
    .returning('event_id')
}

function updateGuest(guest) {
  return db('event_guests')
    .update(guest)
    .where({event_id: guest.event_id})
    .where({user_id: guest.user_id})
}

function removeGuest(event_id, user_id) {
  return db('event_guests')
    .del()
    .where({event_id})
    .where({user_id})
}