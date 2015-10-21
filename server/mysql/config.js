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

module.exports = db = require('bookshelf')(knex);
db.plugin('registry');

db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    return db.knex.schema.createTable('users', function(t) {
      t.increments('id').primary();
      t.string('fbId', 100);
      t.string('username', 100);
      t.string('profile_url', 100)
      t.text('about');
    });
  }
})
.then(function(t) {
  console.log('created table:', t);
});

db.knex.schema.hasTable('tasks').then(function(exists) {
  if (!exists) {
    return db.knex.schema.createTable('tasks', function(t) {
      t.increments('id').primary();
      t.string('description', 100);
      t.boolean('complete');
      t.integer('user_id');
      t.timestamps();
    });
  }
})
.then(function(t) {
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
.then(function(t) {
  console.log('created table:', t);
});

db.knex.schema.hasTable('trainers').then(function(exists) {
  if (!exists) {
    return db.knex.schema.createTable('trainers', function(t) {
      t.increments('id').primary();
      t.integer('trainers_id');
      t.integer('user_id');
    });
  }
})
.then(function(t) {
  console.log('created table:', t);
});

db.knex.schema.hasTable('stats').then(function(exists) {
  if (!exists) {
    return db.knex.schema.createTable('stats', function(t) {
      t.increments('id').primary();
      t.integer('weight');
      t.integer('user_id');
      t.timestamps();
    });
  }
})
.then(function(t) {
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
.then(function(t) {
  console.log('created table:', t);
});

db.knex.schema.hasTable('messages').then(function(exists) {
  if (!exists) {
    return db.knex.schema.createTable('messages', function(t) {
      t.increments('id').primary();
      t.integer('messages_id');
      t.integer('user_id');
      t.string('text', 100);
      t.timestamps();
    });
  }
})
.then(function(t) {
  console.log('created table:', t);
});

module.exports = db;
