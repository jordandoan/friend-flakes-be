const db = require("../../data/dbconfig");

module.exports = {
  getAll,
  getById,
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