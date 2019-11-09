exports.up = function(knex) {
  return knex.schema.createTable('event_guests', tbl => {
    tbl.integer('event_id')
      .notNullable()
      .references('id')
      .inTable('events');
    tbl.integer('user_id', 128)
      .notNullable()
      .references('id')
      .inTable('users');
    tbl.boolean('attended', 128)
      .notNullable();
    tbl.primary(['event_id', 'user_id'])
  });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('event_guests')
};
