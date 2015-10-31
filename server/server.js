var express = require('express');
var db = require('./mysql/config');
var bodyParser = require('body-parser');
var passport = require('passport');
var morgan = require('morgan');
var Promise = require('bluebird');
var app = express();
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
  if(res.user) {
    res.json(req.user.toJSON());
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
  var distPref = req.body.distPref;
  var inputLat = req.body.inputLat;
  var inputLng = req.body.inputLng;
  db.collection('Geolocations').fetchAll()
  .then(function(results) {
    return Promise.all(results.models.filter(function(model){
      var users_lat = model.attributes.lat;
      var users_lng = model.attributes.lng;
      if(geodist({lat: inputLat, lon: inputLng },{lat: users_lat, lon: users_lng}) < distPref) {
        return model;
      }
    }))
    .then(function(nearestUsers){
      return Promise.all(nearestUsers.map(function(user) {
        return db.model('User').fetchById({
          id: user.attributes.user_id
          });
        }))
        .then(function(users) {
          return Promise.all(users.map(function(user) {
            var userId = req.user.attributes.id;
            var swipedId = user.attributes.id;
            return db.collection('Swipes').fetchBySwiped(userId, swipedId)
            .then(function(result) {
               if(result.length === 0) {
                console.log('THIS IS IN IF')
                return user;
              }
          })
        }))
        .then(function(user) {
          if(user[0] === undefined ) {
            console.log('{nearbyUsers: None}')
            res.json({nearbyUsers: 'None'})
            return
          } else {
            console.log('THIS IS IN ELSE AND SAVING', user)
            res.json(user);
            return Promise.all(user.map(function (user) {
              return db.model('Swipe').newSwipe({
                user_id: req.user.attributes.id,
                swiped_id: user.attributes.id,
                swiped: false,
                swiped_left: false,
                swiped_right: false
              })
              .save()
            }))
          }
        })
      })
    })
  })
});

//On Right Swipe Check if Swiped User has Also Swiped Right on the User
app.get('/auth/matchcheck/:id', function (req, res) {
  var swipedId = req.user.attributes.id;
  var userId = req.params.id;
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
  console.log('LOGOUT REQ.USER', req.user.attributes);
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
app.get('/auth/friendrequests', function (req, res) {
  var userId = req.user.attributes.id;
  db.collection('friendRequests').fetchByUser(userId)
  .then(function(friendRequests) {
    return Promise.all(friendRequests.models.map(function(filtered) {
      if(result.attributes.status === 0) {
        console.log('this is the result', filtered)
        return filtered;
      }
    })).then(function(result) {
      console.log('this is the final result of friend_requests :', result)
      res.json(result);
    });
  });
});

//Notifications for Pending Friend Requests
app.get('/auth/clientrequests', function (req, res) {
  var userId = req.user.attributes.id;
  db.collection('clientRequests').fetchByUser(userId)
  .then(function(clientRequests) {
    return Promise.all(clientRequests.models.map(function(filtered) {
      if(result.attributes.status === 0) {
        console.log('this is the result', filtered)
        return filtered;
      }
    })).then(function(result) {
      console.log('this is the finalresult of client_requests :', result)
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
    console.log('THIS IS USER :', result.relations.chatstores.models);
    return Promise.all(result.relations.chatstores.models.map(function(msg){
      console.log('CHAT ID :', msg.attributes.chat_id)
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
    console.log('THIS IS YOUR DEADLIFTS', user);
    res.json(user.toJSON());
  });
});

app.get('/auth/squats/:id', function (req, res){
  var userId = req.params.id;
  db.collection('Squats').fetchByUser(userId)
  .then(function(user){
    console.log('THIS IS YOUR SQUATS', user);
    res.json(user.toJSON());
  });
});

app.get('/auth/speeds/:id', function (req, res){
  var userId = req.params.id;
  db.collection('Speeds').fetchByUser(userId)
  .then(function(user){
    console.log('THIS IS YOUR SPEED', user);
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
    console.log('ERR IN POST /auth/tasks : ', err);
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
    console.log('ERR IN POST /auth/tasks : ', err);
  });
});

// Update User's Task to Complete
app.post('/auth/task/complete/:id', function(req, res) {
  var taskId = req.params.id;
  db.model('Task').completeTask(taskId)
  .then(function () {
    console.log('TASK UPDATED TO COMPLETE :', db.model('Task').fetchByUser(req.user.attributes.id));
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
    console.log('ADDED NEW CLIENT :', newClient);
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
  console.log("After the route is called", clientId)
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
})

// Send a friend request
app.post('/auth/friendreq/add:id', function (req, res){
  var userId = req.user.attributes.id;
  var friendId = req.params.id;
  db.model('friendRequest').newFriendRequest({
    friend_id: friendId,
    user_id: userId,
    status: 0,
    created_at: new Date()
  })
  .save()
  .then(function (){
    db.model('friendRequest').newFriendRequest({
      friend_id: userId,
      user_id: friendId,
      status: 0,
      created_at: new Date()
    })
    .save()
  })
  .then(function (friendreq){
    console.log('ADD FRIEND REQUEST', friendreq);
    return friendreq;
  })
  .catch(function(err){
    return err;
  })
})

// Confirm friend request and add each other as friend
app.post('/auth/confirmfriend/:id', function (req, res){
  var userId = req.user.attributes.id;
  var friendId = req.params.id;
  db.model('friendRequest').acceptFriendRequest({
    friend_id: friendId,
    user_id: userId,
    updated_at: new Date()
  })
  .then(function () {
    db.model('friendRequest').acceptFriendRequest({
      friend_id: userId,
      user_id: friendId,
      updated_at: new Date()
    })
  })
  .then(function(){
     db.model('Friend').newFriend({
      friends_id: friendId,
      user_id: userId
    })
    .save()
  })
  .then(function() {
    db.model('Friend').newFriend({
      friends_id: userId,
      user_id: friendId
    })
    .save()
  })
  .then(function (acceptReq) {
    console.log('Request accepted', acceptReq);
    return acceptReq;
  })
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
      console.log("THIS IS MY RESULT: ", result);
      db.model('Chatstore').newChatStore({
        chat_id: result.id,
        user_id: userId1,
        created_at: new Date()
      })
    .save()
    })
    .then(function(){
      console.log("THIS IS MY SECOND RESULT: ", chatId);
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
  console.log(chatId, 'this is chatID', userId, 'this is user id', body, 'this is body');
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
  console.log('YOUR SPEED ON POST BRO', currSpeed);
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
  var locationId = req.user.relations.geolocations.models[0].attributes.id;
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
      return db.model('Geolocation').updateLocation(locationId,lat, lng);
    };
  });
});

//User Swiped Left on Swiped User
app.post('/auth/leftswipe:id', function (req,res) {
  var userId = req.user.attributes.id;
  var swipedId = req.params.id;
  db.collection('Swipes').fetchBySwiped(userId, swipedId)
  .then(function(result) {
    db.model('Swipe').updateLeftSwipe(result.models[0].attributes.id)
  })
})

//User Swipes Right on Swiped User
app.post('/auth/rightswipe:id', function (req,res) {
  var userId = req.user.attributes.id;
  var swipedId = req.params.id;
  db.collection('Swipes').fetchBySwiped(userId, swipedId)
  .then(function(result) {
    db.model('Swipe').updateRightSwipe(result.models[0].attributes.id)
  })
})

function ensureAuthenticated(req, res, next) {
  console.log('AUTHENTICATED FUNCTION');
  if(req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/');
  }
}

// app.listen(port, function(){
//   console.log('listening on port...', port);
// });


// io.sockets.on('connection', function (socket){
//   var userObj = socket.client.request.user;
//   var chatroomId;

//   if (userObj !== undefined){
//     // emit user's facebook name
//     socket.emit('user name', {username: userObj.get('username')});
//   }

//   // new chat room
//   socket.on('chatroom id', function(id){
//     chatroomId = id;
//     socket.join(id);
//     db.model('Chat').fetchById(id)
//   .then(function (id){
//     console.log("WHAT IS THIS ID", id)
//     return Promise.all(id.relations.message.models.map(function(message){
//       console.log("WHAT IS THIS SHIT", message);
//       return message;
//     }))
//   })
//   .then(function (messages){
//     messages.forEach(function (message){
//       var messageObj = message.toJSON();
//       db.model('User').fetchById(message.get('user_id'))
//       .then(function (user){
//         // console.log("LET ME SEE WHAT THIS IS", user);
//         messageObj.name = user.get('username');
//         socket.emit('new chat', messageObj);
//         });
//       });
//     });
//   });

//   socket.on('new chat', function(chat){
//     if(userObj){
//       var messageObj;
//       db.model('Message').newMessage(text, chatroomId, userObj)
//       .then( function(message){
//         messageObj = message.toJSON();
//         return db.model('User').fetchById(messageObj.user_id);
//       })
//       .then(function(user){
//         messageObj.name = user.get('username');
//         io.to(chatroomId).emit('new chat', messageObj);
//       })
//     }
//   });
// });
