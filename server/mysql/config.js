var knex = require('knex')({
  client: 'mysql',
  connection: {
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
    database : 'crptfit',
    charset  : 'utf8'
  }
});

var db = require('bookshelf')(knex);
db.plugin('registry');

db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    return db.knex.schema.createTable('users', function(t) {
      t.increments('id').primary();
      t.string('username', 100);
      t.string('first_name', 100);
      t.string('last_name', 100);
      t.text('about');
    });
  }
})
.then(function(t){
  console.log('created table:', t);
});

db.knex.schema.hasTable('tasks').then(function(exists) {
  if (!exists) {
    return db.knex.schema.createTable('tasks', function(t) {
      t.increments('id').primary();
      t.string('description', 100);
      t.boolean('complete');
      t.integer('user_id');
    });
  }
})
.then(function(t){
  console.log('created table:', t);
});

db.knex.schema.hasTable('clients').then(function(exists) {
  if (!exists) {
    return db.knex.schema.createTable('clients', function(t) {
      t.increments('id').primary();
      t.integer('clients_id');
      t.integer('user_id');
    });
  }
})
.then(function(t){
  console.log('created table:', t);
});

db.knex.schema.hasTable('stats').then(function(exists) {
  if (!exists) {
    return db.knex.schema.createTable('stats', function(t) {
      t.increments('id').primary();
      t.integer('weight');
      t.integer('user_id');
    });
  }
})
.then(function(t){
  console.log('created table:', t);
});

db.knex.schema.hasTable('friends').then(function(exists) {
  if (!exists) {
    return db.knex.schema.createTable('friends', function(t) {
      t.increments('id').primary();
      t.integer('friends_id');
      t.integer('user_id');
    });
  }
})
.then(function(t){
  console.log('created table:', t);
});

module.exports = db;