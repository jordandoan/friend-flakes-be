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
    .first(); 
}

function getInfobyId(id) {
  return db('events as e')
    .whereRaw(`e.id == ${id}`)
    .join('users as u','u.id','e.user_id')
    .select('e.id', 'u.id as user_id', 'u.username as created_by', 'u.first_name', 'u.last_name', 'e.title','e.description','e.date','e.points')
    .first();

}

function add(event) {
  return db('events')
    .insert(event)
    .then(ids => ids[0])
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