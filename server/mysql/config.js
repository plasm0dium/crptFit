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
      t.string('profile_pic', 400);
      t.string('birthday', 20);
      t.string('email', 30);
      t.string('gender', 10);
      t.text('profile');
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
      t.integer('user_id').references('id').inTable('users');
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
      t.integer('user_id').references('id').inTable('users');
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
      t.integer('trainer_id');
      t.integer('user_id').references('id').inTable('users');
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
      t.integer('benchpress');
      t.integer('squat');
      t.integer('deadlift');
      t.integer('speed')
      t.integer('user_id');
      t.integer('tasks')
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
      t.string('status', 50);
      t.integer('friends_id').references('id').inTable('users');
      t.integer('user_id').references('id').inTable('users');
    });
  }
})
.then(function(t) {
  console.log('created table:', t);
});

db.knex.schema.hasTable('chats').then(function(exists) {
  if (!exists) {
    return db.knex.schema.createTable('chats', function(t) {
      t.increments('id').primary();
      t.integer('user_id').references('id').inTable('users');
      t.integer('user2_id').references('id').inTable('users');
      t.timestamps();
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
      t.integer('chat_id').references('id').inTable('chats');
      t.integer('user_id').references('id').inTable('user');
      t.string('text', 200);
      t.timestamps();
    });
  }
})
.then(function(t) {
  console.log('created table:', t);
});

db.knex.schema.hasTable('friend_request').then(function(exists) {
  if (!exists) {
    return db.knex.schema.createTable('friend_request', function(t) {
      t.increments('id').primary();
      t.integer('friend_id');
      t.integer('user_id');
      t.integer('status', 10);
      t.timestamps();
    });
  }
})
.then(function(t) {
  console.log('created table:', t);
});

db.knex.schema.hasTable('client_request').then(function(exists) {
  if (!exists) {
    return db.knex.schema.createTable('client_request', function(t) {
      t.increments('id').primary();
      t.integer('client_id');
      t.integer('user_id');
      t.integer('status', 10);
      t.timestamps();
    });
  }
})
.then(function(t) {
  console.log('created table:', t);
});


module.exports = db;
