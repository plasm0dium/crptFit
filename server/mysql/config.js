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
      t.integer('user_id');
      t.timestamp('created_at');
      t.timestamp('updated_at');
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
      t.integer('client_id');
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
      t.integer('trainer_id');
      t.integer('user_id');
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
      t.integer('chat_id');
      t.integer('user_id');
      t.string('text', 200);
      t.timestamp('created_at');
      t.timestamp('updated_at');
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
      t.boolean('friend_req');
      t.timestamp('created_at');
      t.timestamp('updated_at');
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
      t.timestamp('created_at');
      t.timestamp('updated_at');
    });
  }
})
.then(function(t) {
  console.log('created table:', t);
});

db.knex.schema.hasTable('weights').then(function(exists) {
  if (!exists) {
    return db.knex.schema.createTable('weights', function(t) {
      t.increments('id').primary();
      t.integer('weight');
      t.integer('user_id');
      t.timestamp('created_at');
      t.timestamp('updated_at');
    });
  }
})
.then(function(t) {
  console.log('created table:', t);
});

db.knex.schema.hasTable('chat').then(function(exists) {
  if (!exists) {
    return db.knex.schema.createTable('chat', function(t) {
      t.increments('id').primary();
      t.timestamp('created_at');
      t.timestamp('updated_at');
    });
  }
})
.then(function(t) {
  console.log('created table:', t);
});

db.knex.schema.hasTable('chatstore').then(function(exists) {
  if (!exists) {
    return db.knex.schema.createTable('chatstore', function(t) {
      t.increments('id').primary();
      t.integer('user_id');
      t.integer('chat_id');
      t.timestamp('created_at');
      t.timestamp('updated_at');
    });
  }
})
.then(function(t) {
  console.log('created table:', t);
});


db.knex.schema.hasTable('benchpress').then(function(exists) {
  if (!exists) {
    return db.knex.schema.createTable('benchpress', function(t) {
      t.increments('id').primary();
      t.integer('benchpress');
      t.integer('user_id');
      t.timestamp('created_at');
      t.timestamp('updated_at');
    });
  }
})
.then(function(t) {
  console.log('created table:', t);
});

db.knex.schema.hasTable('squats').then(function(exists) {
  if (!exists) {
    return db.knex.schema.createTable('squats', function(t) {
      t.increments('id').primary();
      t.integer('squat');
      t.integer('user_id');
      t.timestamp('created_at');
      t.timestamp('updated_at');
    });
  }
})
.then(function(t) {
  console.log('created table:', t);
});

db.knex.schema.hasTable('deadlifts').then(function(exists) {
  if (!exists) {
    return db.knex.schema.createTable('deadlifts', function(t) {
      t.increments('id').primary();
      t.integer('deadlift');
      t.integer('user_id');
      t.timestamp('created_at');
      t.timestamp('updated_at');
    });
  }
})
.then(function(t) {
  console.log('created table:', t);
});

db.knex.schema.hasTable('speeds').then(function(exists) {
  if (!exists) {
    return db.knex.schema.createTable('speeds', function(t) {
      t.increments('id').primary();
      t.integer('speed');
      t.integer('user_id');
      t.timestamp('created_at');
      t.timestamp('updated_at');
    });
  }
})
.then(function(t) {
  console.log('created table:', t);
});

db.knex.schema.hasTable('geolocations').then(function(exists) {
  if (!exists) {
    return db.knex.schema.createTable('geolocations', function(t) {
      t.increments('id').primary();
      t.float('lat');
      t.float('lng');
      t.integer('user_id')
      t.timestamp('created_at');
      t.timestamp('updated_at');
    });
  }
})
.then(function(t) {
  console.log('created table:', t);
});

db.knex.schema.hasTable('swipes').then(function(exists) {
  if (!exists) {
    return db.knex.schema.createTable('swipes', function(t) {
      t.increments('id').primary();
      t.integer('user_id');
      t.integer('swiped_id');
      t.boolean('swiped');
      t.boolean('swiped_left');
      t.boolean('swiped_right')
      t.timestamp('created_at');
      t.timestamp('updated_at');
    });
  }
})
.then(function(t) {
  console.log('created table:', t);
});

db.knex.schema.hasTable('matches').then(function(exists) {
  if (!exists) {
    return db.knex.schema.createTable('matches', function(t) {
      t.increments('id').primary();
      t.integer('user_id');
      t.integer('match_id');
      t.timestamp('created_at');
    });
  }
})
.then(function(t) {
  console.log('created table:', t);
});

module.exports = db;
