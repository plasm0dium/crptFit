var Promise = require('bluebird');

var knex = require('knex')({
  client: process.env.dbClient || 'postgres',
  connection: process.env.DATABASE_URL || {
    host     : process.env.dbHost || '127.0.0.1',
    user     : process.env.dbUser || 'root',
    password : process.env.dbPassword || '',
    database : process.env.dbDatabase || 'crptfit',
    charset  : 'utf8'
  }
});

module.exports = db = require('bookshelf')(knex);
db.plugin('registry');

var buildTable = function(name, callback) {
  return db.knex.schema.hasTable(name)
  .then(function(exists) {
    if (exists) {
      return { name: name, created: false };
    } else {
      return db.knex.schema.createTable(name, callback);
    }
  })
  .then(function(response) {
    if (!response.name) {
      qb = response;
      if (qb) {
        return { name: name, created: true };
      } else {
        return { name: name, created: false };
      }
    } else { return response; }
  });
};

var userProfiles = buildTable('users', function(t) {
      t.increments('id').primary();
      t.string('fbId', 100);
      t.string('username', 100);
      t.string('profile_pic', 400);
      t.string('birthday', 20);
      t.string('email', 30);
      t.string('gender', 10);
      t.text('profile');
});

var userTasks = buildTable('tasks', function(t) {
      t.increments('id').primary();
      t.string('description', 100);
      t.boolean('complete');
      t.integer('user_id');
      t.timestamps();
});

var userClients = buildTable('clients', function(t) {
      t.increments('id').primary();
      t.integer('client_id');
      t.integer('user_id');
});

var userTrainers = buildTable('trainers', function(t) {
      t.increments('id').primary();
      t.integer('trainer_id');
      t.integer('user_id');
});

var userFriends = buildTable('friends', function(t) {
      t.string('status', 50);
      t.integer('friends_id');
      t.integer('user_id');
});

var userMessages = buildTable('messages', function(t) {
      t.increments('id').primary();
      t.integer('chat_id');
      t.integer('user_id');
      t.string('text', 200);
      t.timestamps();
});

var userFriendRequest = buildTable('friend_request', function(t) {
      t.increments('id').primary();
      t.integer('friend_id');
      t.integer('user_id');
      t.integer('status', 10);
      t.timestamps();
});

var userClientRequest = buildTable('client_request', function(t) {
      t.increments('id').primary();
      t.integer('client_id');
      t.integer('user_id');
      t.integer('status', 10);
      t.timestamps();
});

var userWeights = buildTable('weights', function(t) {
      t.increments('id').primary();
      t.integer('weight');
      t.integer('user_id');
      t.timestamps();
});

var userChat = buildTable('chat', function(t) {
      t.increments('id').primary();
      t.timestamps();
});

var userChatStore = buildTable('chatstore', function(t) {
      t.increments('id').primary();
      t.integer('user_id');
      t.integer('chat_id');
      t.timestamps();
});

var userBenchPress = buildTable('benchpress', function(t) {
      t.increments('id').primary();
      t.integer('benchpress');
      t.integer('user_id');
      t.timestamps();
});

var userSquats = buildTable('squats', function(t) {
      t.increments('id').primary();
      t.integer('squat');
      t.integer('user_id');
      t.timestamps();
});

var userDeadLifts = buildTable('deadlifts', function(t) {
      t.increments('id').primary();
      t.integer('deadlift');
      t.integer('user_id');
      t.timestamps();
    });

var userSpeeds = buildTable('speeds', function(t) {
      t.increments('id').primary();
      t.integer('speed');
      t.integer('user_id');
      t.timestamps();
});

var userGeolocations = buildTable('geolocations', function(t) {
      t.increments('id').primary();
      t.integer('longtitude');
      t.integer('latitude');
      t.integer('user_id');
      t.timestamps();
});

var tables = [userProfiles, userTasks, userClients, userTrainers, userFriends, userMessages, userFriendRequest, userClientRequest, userWeights, userChat, userChatStore, userBenchPress, userSquats, userDeadLifts, userSpeeds, userGeolocations];

Promise.all(tables)
.then(function(tables){
  tables.forEach(function(table){
    if(table.created) {
      console.log('Bookshelf: created table', table.name);
    } else {
      console.log('Bookshelf:', table.name, 'table already exists');
    }
  });
});
