exports.up = function(knex) {
  return knex.schema.createTable('events', tbl => {
    tbl.increments();
    tbl.integer('user_id', 128)
      .notNullable()
      .references('id')
      .inTable('users');
    tbl.string('title', 128)
      .notNullable();
    tbl.integer('points')
      .unsigned()
      .notNullable();
    tbl.date('date')
      .notNullable();
    tbl.string('description', 2000)
  });
};

exports.down = function(knex) {
  return knex.schema
          .dropTableIfExists('events')
};
