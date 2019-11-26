exports.up = function(knex) {
  return knex.schema.createTable('friends', tbl => {
    tbl.increments();
    tbl.integer('request_from', 128)
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    tbl.integer('request_to', 128)
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    tbl.boolean('accepted')
      .notNullable()
    tbl.primary(['request_from','request_to'])
  });
};

exports.down = function(knex) {
  return knex.schema
          .dropTableIfExists('friends')
};
