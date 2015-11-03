var express = require('express');
var db = require('./mysql/config');
var bodyParser = require('body-parser');
var passport = require('passport');
var morgan = require('morgan');
var Promise = require('bluebird');
var app = express();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);
var port = process.env.PORT || 8100;
var server = app.listen(port);
var io = require('socket.io').listen(server);
var geodist = require('geodist');

require('./mysql/models/client');
require('./mysql/models/friend');
require('./mysql/models/trainer');
require('./mysql/models/task');
require('./mysql/models/user');
require('./mysql/models/friend_request');
require('./mysql/models/client_request');
require('./mysql/models/chat');
require('./mysql/models/message');
require('./mysql/models/weight');
require('./mysql/models/benchpress');
require('./mysql/models/squat');
require('./mysql/models/deadlift');
require('./mysql/models/speed');
require('./mysql/models/chatstore');
require('./mysql/models/geolocation');
require('./mysql/models/swipe');
require('./mysql/models/match');

require('./mysql/collections/clients');
require('./mysql/collections/friends');
require('./mysql/collections/trainers');
require('./mysql/collections/tasks');
require('./mysql/collections/users');
require('./mysql/collections/friend_requests');
require('./mysql/collections/client_requests');
require('./mysql/collections/chats');
require('./mysql/collections/messages');
require('./mysql/collections/weights');
require('./mysql/collections/Benchpress');
require('./mysql/collections/squats');
require('./mysql/collections/deadlifts');
require('./mysql/collections/speeds');
require('./mysql/collections/chatstores');
require('./mysql/collections/geolocations');
require('./mysql/collections/swipes');
require('./mysql/collections/matches');

var session = require("express-session");
app.use(session({
  key: 'crptFit',
  secret: 'Ted',
  enabledProof: false,
  resave: false,
  saveUninitialized: true
}));


app.use(express.static(__dirname + '/../client/mobile/www'));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./passport')(passport);

app.use(passport.initialize());
app.use(passport.session());
// Direct to Facebook Login
app.get('/auth/facebook',
  passport.authenticate('facebook', {
    scope: ['public_profile', 'email', 'user_friends', 'user_birthday']
 }));

// Facebook Auth Callback
app.get('/auth/facebook/callback', function (req, res, next) {
  passport.authenticate('facebook',
    function(err, user, info) {
      if (err) { return next(err); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        res.redirect( '/#/tab/homepage' );
      });
    })(req, res, next);
});

app.get('/tab/homepage', ensureAuthenticated, function (req,res) {
  console.log('THIS USER IS LOGGED IN', req.user)
  var user = req.user
  if(user) {
    res.json(user);
  } else {
    res.redirect('/');
  }
});

// Fetch a Specific User by Id
app.get('/auth/user/:id', function (req, res) {
  var userId = req.params.id;
  db.model('User').fetchById({
    id: userId
  })
  .then(function(result) {
    res.json(result.toJSON());
  });
});

//Fetch Nearest Users to Logged in User
app.get('/auth/nearbyusers', function (req, res) {
  var inputLat = req.user.relations.geolocations.models[0].attributes.lat;
  var inputLng = req.user.relations.geolocations.models[0].attributes.lng;
  var userId = req.user.attributes.id;
  db.collection('Geolocations').fetchAll()
  .then(function(results) {
    //Find all user's with a 25 mile radius
    return Promise.all(results.models.filter(function(model){
      var users_lat = model.attributes.lat;
      var users_lng = model.attributes.lng;
      console.log('DISTANCE', geodist({lat: inputLat, lon: inputLng },{lat: users_lat, lon: users_lng}))
      if(geodist({lat: inputLat, lon: inputLng },{lat: users_lat, lon: users_lng}) < 25 && model.attributes.user_id !== userId) {
        console.log(' 1 THIS IS MODEL', model)
        return model;
      }
    }))
    //Map the nearby users objects
    .then(function(nearestUsers){
      console.log(' 2 SECOND BLOCK')
      return Promise.all(nearestUsers.map(function(user) {
        return db.model('User').fetchById({
          id: user.attributes.user_id
          });
        }))
        //Check if the nearby users are already in the Swipes table
        //only return those who havent previously been swiped
        .then(function(users) {
          console.log(' 3 THIRD BLOCK')
          return Promise.all(users.filter(function(user) {
            var userId = req.user.attributes.id;
            var swipedId = user.attributes.id;
            return db.collection('Swipes').fetchBySwiped(userId, swipedId)
            .then(function(result) {
              console.log(' 4 FOURTH BLOCK THIS IS RESULT OF SWIPES FETCH', result)
               if(result.length === 0) {
                 //if they don't exist in user's swipes save them first & return them
                console.log(' 5 THIS USER ISNT IN SWIPES YET SO SAVE THIS USER & return:', user)
                db.model('Swipe').newSwipe({
                  user_id: req.user.attributes.id,
                  swiped_id: user.attributes.id,
                  swiped: false,
                  swiped_left: false,
                  swiped_right: false
                })
                .save()
                return user
              } else {
                result.models.filter(function(user) {
                  return user.attributes.swiped === 0 || undefined
                })
              }
          })
        }))
      })
    })
  })
        //if no users are found nearby then user[0] will be undefined
        .then(function(user) {
          console.log(' 6 THIS IS USER IN LAST BLOCK', user)
          if(user[0] === undefined ) {
            console.log('{nearbyUsers: None}')
            res.json({nearbyUsers: 'None'})
            return
          } else {
            console.log(' 7 THESE ARE USERS WHO HAVENT BEEN SWIPED YET AND ARE RES>JSON', user)
            res.json(user);
          }
        })
        })

//On Right Swipe Check if Swiped User has Also Swiped Right on the User
app.get('/auth/matchcheck/:id', function (req, res) {
  var swipedId = req.user.attributes.id;
  var userId = req.params.id;
  console.log('IN MATCHCHECK')
  db.collection('Swipes').fetchBySwiped(userId, swipedId)
  .then(function(exists) {
    if(exists.length === 0) {
      res.json({match: false});
    } else {
      if(exists.models[0].attributes.swiped_right === 1) {
        res.json({match: true});
      } else {
        res.json({match: false});
      };
    };
  });
});

//News Feed Pulls Latest Completed Tasks of Friends
var taskStore = [];
app.get('/auth/newsfeed', function (req, res) {
  db.collection('Friends').fetchByUser(req.user.attributes.id)
  .then(function(users) {
      return Promise.all(users.models.map(function(friend) {
         return db.model('User').fetchById({
          id: friend.attributes.friends_id
        });
      }));
    })
      .then(function(results){
        res.json(results);
        return Promise.all(results.map(function(model) {
            model.relations.tasks.models.forEach(function(task){
              if (task.attributes.complete === 1){
                taskStore.push(task);
              }
            });
         }));
      })
      .then(function(){
        res.json(taskStore);
      })
      .then(function(){
        taskStore = [];
      });
});

// Grab the logged in user's user object
app.get('/auth/user', function(req, res){
 db.model('User').fetchById({id: req.user.attributes.id})
 .then(function(user){
   console.log('THIS IS AUTH?PICTURE', user)
   res.json(user);
 });
});

// Logout User
app.get('/logout', function(req, res){
  req.session.destroy();
  req.logout();
  res.redirect('/');
});

// Get All User's Tasks
app.get('/auth/tasks', function (req,res) {
  db.collection('Tasks').fetchByUser(req.user.attributes.id)
  .then(function(tasks) {
    res.json(tasks.toJSON());
  });
});

// Get current user's completed Tasks
app.get('/auth/usertask/:id', function (req, res){
var userId = req.user.attributes.id;
  db.model('User').fetchById({
    id: userId
  })
  .then(function(user){
    console.log("THIS IS CURRENT USER", user)
    return Promise.all(user.relations.tasks.models.map(function(tasks){
      console.log("TASKS ARE HERE", tasks)
          if(tasks.attributes.complete === 1){
            return tasks;
          }
      }))
    .then(function(results){
      res.json(results);
    });
  });
});


// Fetch Logged in Users Friends
var storage = [];
app.get('/auth/friends', function (req, res) {
  db.collection('Friends').fetchByUser(req.user.attributes.id)
  .then(function(friends) {
    var friendsArray = friends.models;
    for(var i = 0; i < friendsArray.length; i++ ) {
      db.model('User').fetchById({
        id: friendsArray[i].attributes.friends_id
      })
      .then(function(result) {
        storage.push(result);
      })
    }})
      .then(function() {
        return res.json(storage);
      }).then(function () {
        storage = [];
      });
  });

// Fetch a User's Clients
var Cstorage = [];
app.get('/auth/clients', ensureAuthenticated,function (req, res) {
  db.collection('Clients').fetchByUser(req.user.attributes.id)
  .then(function(clients) {
    var clientsArray = clients.models;
    for(var i = 0; i < clientsArray.length; i++ ) {
      db.model('User').fetchById({
        id: clientsArray[i].attributes.clients_id
      })
      .then(function(result) {
        Cstorage.push(result);
      })
    }})
      .then(function() {
        return res.json(Cstorage);
      }).then(function () {
        Cstorage = [];
      });
});
//Fetch a User's Trainers
var Tstorage = [];
app.get('/auth/trainers', ensureAuthenticated, function (req, res) {
  db.collection('Trainers').fetchByUser(req.user.attributes.id)
  .then(function(trainers) {
    var trainersArray = trainers.models;
    for(var i = 0; i < trainersArray.length; i++ ) {
      db.model('User').fetchById({
        id: trainersArray[i].attributes.trainer_id
      })
      .then(function(result) {
        Tstorage.push(result);
      })
    }})
      .then(function() {
        return res.json(Tstorage);
      }).then(function () {
        Tstorage = [];
      });
});

//Search a Friend's Friends
  app.get('/auth/friends/:id', function (req, res) {
    db.collection('Friends').fetchByUser(req.params.id)
    .then(function(friends) {
      var friendsArray = friends.models;
      for(var i = 0; i < friendsArray.length; i++ ) {
        db.model('User').fetchById({
          id: friendsArray[i].attributes.friends_id
        })
        .then(function(result) {
          storage.push(result);
        })
      }})
        .then(function() {
          return res.json(storage);
        }).then(function () {
          storage = [];
        })
    });

//Search All Users to Add as Friend
app.get('/auth/search/:id', function (req, res) {
  var username = req.params.id;
  db.collection('Users').searchByUsername(username)
  .then(function (username) {
    return Promise.all(username.models.map(function(friend){
      return db.model('User').fetchById({
        id: friend.attributes.id
      })
    }))
      .then(function (results){
        return res.json(results);
      });
  });
});

//Notifications for Pending Friend Requests
app.get('/auth/friendrequests/', function (req, res) {
  var userId = req.user.attributes.id;
  db.collection('friendRequests').fetchByUser(userId)
  .then(function(friendRequests) {
    console.log("YO WHERE IS MY SHIT", friendRequests);
    return Promise.all(friendRequests.models.map(function(friends) {
      console.log("WHERE ARE MY FRIENDS", friends)
      if(friends.attributes.status === 0 && friends.attributes.friend_req === 1) {
        console.log('this is the result', friends);
        return db.model('User').fetchById({
          id: friends.attributes.friend_id
        })
      }
    })).then(function(result) {
      res.json(result);
      console.log("WHERE IS MY RESULT", result);
    });
  });
});


//Notifications for Pending Friend Requests
app.get('/auth/clientrequests', function (req, res) {
  var userId = req.user.attributes.id;
  db.collection('clientRequests').fetchByUser(userId)
  .then(function(clientRequests) {
    return Promise.all(clientRequests.models.map(function(filtered) {
      if(filtered.attributes.status === 0) {
        return db.model('User').fetchById({
          id: filtered.attributes.client_id
        });
      }
    })).then(function(result) {
      res.json(result);
    });
    });
});

// Fetch a User's Chat Sessions
app.get('/auth/chatsessions', function(req, res) {
var userId = req.user.attributes.id;
db.model('User').fetchById({
  id: userId
  })
  .then(function(result) {
    return Promise.all(result.relations.chatstores.models.map(function(msg){
      return db.model('Chat').fetchById(msg.attributes.chat_id)
    }))
    .then(function (results){
      res.json(results);
    });
  });
});

// Fetch a User's Weights
app.get('/auth/weight/:id', function (req, res){
  var userId = req.params.id;
  db.collection('Weights').fetchByUser(userId)
  .then(function(user){
    res.json(user.toJSON());
  });
});

app.get('/auth/benchpress/:id', function (req, res){
  var userId = req.params.id;
  db.collection('BenchPress').fetchByUser(userId)
  .then(function(user){
    res.json(user.toJSON());
  });
});

app.get('/auth/deadlift/:id', function (req, res){
  var userId = req.params.id;
  db.collection('DeadLifts').fetchByUser(userId)
  .then(function(user){
    res.json(user.toJSON());
  });
});

app.get('/auth/squats/:id', function (req, res){
  var userId = req.params.id;
  db.collection('Squats').fetchByUser(userId)
  .then(function(user){
    res.json(user.toJSON());
  });
});

app.get('/auth/speeds/:id', function (req, res){
  var userId = req.params.id;
  db.collection('Speeds').fetchByUser(userId)
  .then(function(user){
    res.json(user.toJSON());
  });
});

// Add a New Task to User
app.post('/auth/tasks/:taskname', function (req, res) {
  var task = req.params.taskname;
  db.model('Task').newTask({
    description: task,
    complete: false,
    user_id: req.user.attributes.id
  })
  .save()
  .then(function(task) {
    return task;
  })
  .catch(function (err) {
  });
});

//Add a New Task to Another User
app.post('/auth/tasks/add:userid', function (req, res) {
  var userId = req.params.userid;
  var taskname = req.body.taskname;
  db.model('Task').newTask({
    description: taskname,
    complete: false,
    user_id: userId
  })
  .save()
  .catch(function (err) {
  });
});

// Update User's Task to Complete
app.post('/auth/task/complete/:id', function(req, res) {
  var taskId = req.params.id;
  db.model('Task').completeTask(taskId)
  .then(function () {
  })
  .catch(function (err) {
    return err;
  });
});

//Confirm Client Request and adds Client to User
app.post('/auth/confirmclient', function (req, res) {
  var userId = req.user.attributes.id;
  var clientId = req.params.id;
   db.model('clientRequest').acceptClientRequest({
    user_id: userId,
    client_id: clientId
  })
  .then(function (){
    db.model('clientRequest').acceptClientRequest({
      user_id: clientId,
      client_id: userId
    })
  })
  .then(function (){
  db.model('Client').newClient({
    client_id: userId,
    user_id: clientId
  })
  .save()
  })
  .then(function (){
  db.model('Trainer').newTrainer({
    trainer_id: clientId,
    user_id: user_id
  })
  .save()
  })
  .then(function(newClient) {
    return newClient;
  })
  .catch(function(err) {
    return err;
  });
});

//Send Client Request
app.post('/auth/clientreq/add:id', function (req, res){
  var userId = req.user.attributes.id;
  var clientId = req.params.id;
  db.model('clientRequest').newClientRequest({
    client_id: clientId,
    user_id: userId,
    status: 0,
    created_at: new Date()
  })
  .save()
  .then(function () {
    db.model('clientRequest').newClientRequest({
      client_id: userId,
      user_id: clientId,
      status: 0,
      created_at: new Date()
    })
    .save()
  })
  .catch(function (err){
    return err;
  })
});

// Send a friend request
app.post('/auth/friendreq/:id', function (req, res){
  var userId = req.user.attributes.id;
  var friendId = req.params.id;
  db.model('friendRequest').newFriendRequest({
    friend_id: friendId,
    user_id: userId,
    status: 0,
    friend_req: false
  })
  .save()
  .then(function (){
    db.model('friendRequest').newFriendRequest({
      friend_id: userId,
      user_id: friendId,
      status: 0,
      friend_req: true
    })
    .save();
  })
  .catch(function(err){
    return err;
  });
});

// db.model('friendRequest').newFriendRequest({
//     friend_id: 4,
//     user_id: 1,
//     status: 0,
//     friend_req: false
//   })
//   .save()
//   .then(function (){
//     db.model('friendRequest').newFriendRequest({
//       friend_id: 1,
//       user_id: 4,
//       status: 0,
//       friend_req: true
//     })
//     .save();
//   })

// Confirm friend request and add each other as friend
app.post('/auth/confirmfriend/:id', function (req, res){
  var userId = req.user.attributes.id;
  var friendId = req.params.id;
  db.model('friendRequest').acceptFriendRequest({
    friend_id: friendId,
    user_id: userId
  })
  .then(function () {
    db.model('friendRequest').acceptFriendRequest({
      friend_id: userId,
      user_id: friendId
    })
  })
  .then(function(){
     db.model('Friend').newFriend({
      friends_id: friendId,
      user_id: userId
    })
    .save();
  })
  .then(function() {
    db.model('Friend').newFriend({
      friends_id: userId,
      user_id: friendId
    })
    .save();
  .catch(function(err){
    return err;
  });
});

//Creates a Chat Session
app.post('/auth/chat/add:id', function (req, res){
  var chatId;
  var userId1 = req.user.attributes.id;
  var userId2 = req.params.id;
  db.model('Chat').newChat({
      created_at: new Date()
    })
    .save()
    .then(function(result){
      chatId = result.id;
      db.model('Chatstore').newChatStore({
        chat_id: result.id,
        user_id: userId1,
        created_at: new Date()
      })
    .save()
    })
    .then(function(){
      db.model('Chatstore').newChatStore({
        chat_id: chatId,
        user_id: userId2,
        created_at: new Date()
      })
      .save()
    });
});

//Adds Messages to chat session
app.post('/auth/messages/add:id', function (req, res){
  var userId = req.user.attributes.id;
  var chatId = req.params.id;
  var body = req.body.message;
  db.model('Message').newMessage({
    user_id: userId,
    chat_id: chatId,
    text: body,
    created_at: new Date()
  })
  .save()
});
//Add Current Weight
app.post('/auth/weight/:stat', function (req, res) {
  var userId = req.user.attributes.id;
  var currWeight = req.params.stat;
  db.model('Weight').newWeight({
    weight: currWeight,
    user_id: userId,
    created_at: new Date()
  })
  .save();
});

//Add Current Bench Press
app.post('/auth/bench/:stat', function (req, res) {
  var userId = req.user.attributes.id;
  var currBench = req.params.stat;
  db.model('Benchpress').newBenchPress({
    benchpress: currBench,
    user_id: userId,
    created_at: new Date()
  })
  .save();
});
//Add Current Squat
app.post('/auth/squat/:stat', function (req, res) {
  var userId = req.user.attributes.id;
  var currSquat = req.params.stat;
  db.model('Squat').newSquat({
    squat: currSquat,
    user_id: userId,
    created_at: new Date()
  })
  .save();
});
// Current Deadlift
app.post('/auth/deadlift/:stat', function (req, res) {
  var userId = req.user.attributes.id;
  var currDeadLift = req.params.stat;
  db.model('DeadLift').newDeadLift({
    deadlift: currDeadLift,
    user_id: userId,
    created_at: new Date()
  })
  .save();
});
// Update Current Speed
app.post('/auth/speed/:stat', function (req, res) {
  var userId = req.user.attributes.id;
  var currSpeed = req.params.stat;
  db.model('Speed').newSpeed({
    speed: currSpeed,
    user_id: userId,
    created_at: new Date()
  })
  .save();
});

//Store User's Current Location or Update if it Exists
app.post('/auth/location', function (req, res) {
  var userId = req.user.attributes.id;
  var lat = req.body.lat;
  var lng = req.body.lng;
  console.log('THIS IS LAT', lat)
  console.log('THIS IS LNG', lng)
  db.collection('Geolocations').fetchByUser(userId)
  .then(function(location) {
    if(location.length === 0) {
      console.log('NO LOCATION FOUND')
      return db.model('Geolocation').newLocation({
        lat: lat,
        lng: lng,
        user_id: userId
      })
      .save();
    } else {
      console.log('SAVING LOCATION TO DB')
      var locationId = req.user.relations.geolocations.models[0].attributes.id;
      return db.model('Geolocation').updateLocation(locationId,lat, lng);
    };
  });
});

//User Swiped Left on Swiped User
app.post('/auth/leftswipe/:id', function (req,res) {
  var userId = req.user.attributes.id;
  var swipedId = req.params.id;
  db.collection('Swipes').fetchBySwiped(userId, swipedId)
  .then(function(result) {
    db.model('Swipe').updateLeftSwipe(result.models[0].attributes.id)
  })
})

//User Swipes Right on Swiped User
app.post('/auth/rightswipe/:id', function (req,res) {
  var userId = req.user.attributes.id;
  var swipedId = req.params.id;
  db.collection('Swipes').fetchBySwiped(userId, swipedId)
  .then(function(result) {
    db.model('Swipe').updateRightSwipe(result.models[0].attributes.id)
  })
})

function ensureAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/');
  }
}


// io.on('connection', function(socket){
//   console.log('someone is fooling around in messages');
//   socket.on('event:new:message', function(data){
//     // socket.broadcast.emit('event:outgoing:message', data);
//     console.log(data)
//   })
//   socket.on('event:outgoing:message', function(data){
//     return data;
//   })
// })
// http.listen(port, function(){
//   console.log('listening on port...', port);
// });

server.listen(port, function(){
  console.log('listening on port...', port);
});


io.on('connection', function (socket){
  console.log('youser connected breh')
  var userObj = socket.client.request.user;
  var chatroomId;
  var newMessage;
  console.log(userObj, '<------ userobj, expect undef', 'will be null ------->', chatroomId)
  if (userObj !== undefined){
    // emit user's facebook name
    socket.emit('user name', {username: userObj.get('username')});
  }

  socket.on('connecting', function(id){
    console.log('i heard it coming from on high, the song that ends the world', id)
    socket.join(id);
  })
  // new chat room
  socket.on('chatroom id', function(id, message){
    console.log(id, message)
    socket.join(id)
    io.sockets.in(id).emit('message-append', id, message);
    db.model('Chat').fetchById(id)
  .then(function (id){
    return Promise.all(id.relations.message.models.map(function(message){
      return message;
    }))
  })
  .then(function (messages){
    messages.forEach(function (message){
      var messageObj = message.toJSON();
      db.model('User').fetchById(message.get('user_id'))
      .then(function (user){
        // console.log("LET ME SEE WHAT THIS IS", user);
        messageObj.name = user.get('username');
        socket.emit('new chat', messageObj);
        });
      });
    });
  });

  socket.on('new chat', function(chat){
    if(userObj){
      var messageObj;
      db.model('Message').newMessage(text, chatroomId, userObj)
      .then( function(message){
        messageObj = message.toJSON();
        return db.model('User').fetchById(messageObj.user_id);
      })
      .then(function(user){
        messageObj.name = user.get('username');
        io.to(chatroomId).emit('new chat', messageObj);
      })
    }
  });
});
