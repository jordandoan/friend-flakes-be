const db = require("../../data/dbconfig");

module.exports = {
  getEventGuests
}

function getEventGuests(event_id) {
  return db('event_guests as eg')
    .where({event_id})
    .join('users as u', 'u.id', 'eg.user_id')
    .select('eg.event_id', 'u.username', 'eg.attended')
}
