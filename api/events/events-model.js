const db = require("../../data/dbconfig");

module.exports = {
  getAll,
  getById,
  getInfobyId,
  add,
  edit,
  remove
}

function getAll() {
  return db('events')
}

function getById(id) {
  return db('events')
    .where({id})
    .then(events => events[0])
}

function getInfobyId(id) {
  return db('events as e')
    .whereRaw(`e.id == ${id}`)
    .join('users as u','u.id','e.user_id')
    .select('e.id', 'u.id as user_id', 'u.username as created_by', 'u.first_name', 'u.last_name', 'e.title','e.description','e.date','e.points')
    .then(events => events[0])
}

function add(event) {
  return db('events')
    .insert(event)
    .then(async ids => 
      await db('event_guests')
        .insert({event_id: ids[0], user_id: event.user_id, attended: true})
          .then(filler => ids[0])
    )
}

function edit(id, event) {
  return db('events')
    .where({id})
    .update(event)
}

function remove(id, event) {
  return db('events')
    .where({id})
    .del()
}