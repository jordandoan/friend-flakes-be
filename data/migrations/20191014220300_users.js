
exports.up = function(knex) {
  return knex.schema.createTable('users', tbl => {
    tbl.increments();
    tbl.string('username', 128)
      .unique()
      .notNullable();
    tbl.string('password', 128)
      .notNullable();
    tbl.string('first_name', 128)
      .notNullable();
    tbl.string('last_name', 128)
  })
};

exports.down = function(knex) {
  return knex.schema
          .dropTableIfExists('users')
};
