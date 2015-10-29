angular.module('crptFit.services', [])
// Start of Tasks Factory ====================================================
.factory('Tasks', ['$http', function($http){
  var tasks = [];
  return {
    finishTask : function(task){
      console.log(task)
      $http({
        method: 'POST',
        url: '/auth/task/complete/' +task,
      });
      console.log(task, 'clicked');
      tasks.splice(tasks.indexOf(task), 1);
    },
    getTasksList: function(){
      console.log(tasks, 'this is tasks as soon as its clicked')
        tasks = [];
        $http({
          method: 'GET',
          url: '/auth/tasks'
        }).then(function(response){
          response.data.forEach(function(x){
            if(!x.complete){
              tasks.push(x)
            }
          });
            console.log("Tasks returned from server:", response.data);
          });
          return tasks;
    },
    addTaskToClient : function(uId, val){
      $http({
        method: 'POST',
        url: '/auth/tasks/add'+uId,
        data : {
          taskname: val
        }
      });
    },
    addTaskToSelf: function(val){
      $http({
        method: 'POST',
        url: '/auth/tasks/',
        data : val
      });
    }
  };
}])
// Start of Social Factory ====================================================
.factory('Social', ['$http', function($http){
  // Set up functions for ajax
  var friends = [];
  var clients = [];
  var trainers = [];
  var searchResults = [];
  var savedUserID;

  return {
    userViewerSet: function(userID){
      savedUserID = userID;
    },
    getUserID: function(){
      return savedUserID;
    },
    friendsList: function(){
      // Grab friends and store it in the friends array above (refactor - DRY)
      $http({
        method: 'GET',
        url: '/auth/friends'
      })
      .then(function(response){
        console.log(response.data)
        friends = response.data;
      }, function(error){
        console.log(error);
      });
      return friends;
    },
    getFriendsLength: function(){
      return friends.length;
    },
    sendFriendRequest: function(friend){
      // This function needs the proper AJAX request
    },
    addFriend: function(friendId){
      // This function needs the proper AJAX request
      $http({
        method: 'POST',
        url: '/auth/friends/add:' + friendId
      });
      this.friendsList();
    },
    clientsList: function(){
      // This function needs the proper AJAX request
      // Grab clients and store them in the clients array above (refactor - DRY)
      $http({
        method: 'GET',
        url: '/auth/clients'
      })
      .then(function(response){
        clients = response.data;
        console.log("CLIENTS :", response.data);
      }, function(error){
        console.log(error);
      });
      return clients;
    },
    getClientsLength: function(){
      return clients.length;
    },
    addClient: function(clientId){
      // This function needs the proper AJAX request
      $http({
        method: 'POST',
        url: '/auth/clients/add:' + clientId
      });
      this.clientsList();
    },
    trainersList: function(){
      // This function needs the proper AJAX request
      $http({
        method: 'GET',
        url: '/auth/trainers'
      })
      .then(function(response){
        trainers = response.data;
        console.log("Trainers :", response.data);
      }, function(error){
        console.log(error);
      });
      return trainers;
    },
    getTrainersLength: function(){
      return trainers.length;
    },
    sendTrainerRequest: function(){
      // This function needs the proper AJAX request
    },
    addTrainer: function(trainer){
      // This function needs the proper AJAX request
      trainers.push(trainer);
    },
    searchResultsList: function(username){
      $http({
        method: 'GET',
        url: '/auth/search/' + username
      })
      .then(function(response){
        console.log("inside of the service calling SRL:", response.data)
        return response.data;
      }).then(function(response){
        console.log("final part of SRL from service:", response);
        searchResults = response;
        return searchResults;
      });
    }
  };
}])

// Start of Messages Factory ====================================================
.factory('Message', ['$http', function($http){
  var messages = {};
  var messageReturn = [];
//get user message table from db
  var room_ids = {};
  var capChat;
  return {
    messageToPage : function(){
      newRet = messageReturn;
      messageReturn = [];
      return newRet;
    },
    messageList : function(){
      messageReturn = [];
      for(var key in messages){
        if(messages[key] === parseInt(capChat)){
          messageReturn.push(key);
        }
      }
    },
    clearCap: function(){
      return capChat;
    },
    capturedChatID: function(val){
      capChat = val;
    },
    captureMessages: function(){
      return room_ids;
    },
    makeChat: function(userId){
      $http({
        method: 'POST',
        url: '/auth/chat/add'+userId
      });
    },
    getMessage : function(){
      $http({
        method: 'GET',
        url: '/auth/chatsessions'
      }).then(function(response){
        console.log(response, 'response data');
          response.data.forEach(function(y){
              room_ids[y.id] = y.id;
            y.message.forEach(function(z){
              messages[z.text] = y.id;
              console.log(z.user_id, 'this should be a number');
            });
          });
      }, function(error){
        console.log(error);
      });
    },
    getRoom: function(chatId){
      capChat = chatId;
      $http({
        method: 'GET',
        url: '/auth/chat/get' + chatId
      }).then(function(response){

      });
    },
    sendMessage: function(id, val){
      console.log(id);
      $http({
        method: 'POST',
        url: '/auth/messages/add' + id,
        data: {message: val}
      }).then(function(data){
        console.log(data);
      }, function(error){
        console.log(error);
      });
    },
  };
}])
.factory('Progress', ['$http', function($http){
  var strength = [];
  var weight = [];
  var speed = [];
  var bench = [];
  var dead = [];
  var squat = [];
  //all functions need integration with db
  return {
    getStr : function(){
      return strength;
    },
    getBnch : function(){
      return bench;
    },
    getDed : function(){
      return dead;
    },
    getSqu : function(){
      return squat;
    },
    getSpd : function(){
      return speed;
    },
    getWgt : function(){
      return weight;
    },
    getSelf : function(){
      return selfUid;
    },
    pushBnch : function(val){
      bench.shift();
      bench.push(val);
    },
    pushDed : function(val){
      dead.shift();
      dead.push(val);
    },
    pushSqu : function(val){
      squat.shift();
      squat.push(val);
    },
    pushSpd : function(val){
      speed.shift();
      speed.push(val);
    },
    pushWgt : function(val){
      weight.shift();
      weight.push(val);
    },
    //all functions below here need to be tested and found working
    postBnch: function(stat){
      $http({
        method: 'POST',
        url: '/auth/bench/'+stat
      });
    },
    postDed: function(stat){
      $http({
        method: 'POST',
        url: '/auth/deadlift/'+stat,
      });
    },
    postSqu: function(stat){
      $http({
        method: 'POST',
        url: '/auth/squat/'+stat,
      });
    },
    postSpd : function(stat){
      $http({
        method: 'POST',
        url: '/auth/speed/'+stat,
      });
    },
    postWgt : function(stat){
      $http({
        method: 'POST',
        url: '/auth/weight/'+stat,
      });
    },
    queryBnch : function(val){
      $http({
        method: 'GET',
        url: '/auth/benchpress/'+val
      }).then(function(response){
        if(bench.length === 0){
          for(var i = response.data.length-8; i < response.data.length-1; i++){
            bench.push(response.data[i].benchpress);
          }
        }else{
          bench.shift();
          bench.push(response.data[response.data.length-1].benchpress);
        }
      }, function(error){
        console.log('Something went wrong : ', error);
      });
    },
    queryDed : function(uId){
      $http({
        method: 'GET',
        url: '/auth/deadlift/'+uId
      }).then(function(response){
        if(dead.length === 0){
          for(var i = response.data.length-8; i < response.data.length-1; i++){
            dead.push(response.data[i].deadlift);
          }
        }else{
          dead.push(response.data[response.data.length-1].deadlift);
        }
      }, function(error){
        console.log('Something went wrong : ', error);
      });
    },
    querySqu : function(uId){
      $http({
        method: 'GET',
        url: '/auth/squats/'+uId
      }).then(function(response){
        if(squat.length === 0){
          for(var i = response.data.length-8; i < response.data.length-1; i++){
            squat.push(response.data[i].squat);
          }
        }else{
          squat.push(response.data[response.data.length-1].squat);
        }
      }, function(error){
        console.log('Something went wrong : ', error);
      });
    },
    querySpd : function(uId){
      $http({
        method: 'GET',
        url: '/auth/speeds/'+uId
      }).then(function(response){
        if(speed.length === 0){
          if(response.data.length <= 8){
            for(var x = 0; x < response.data.length-1; x++){
              speed.push(response.data[x].speed);
            }
          }else{
            for(var i = response.data.length-8; i < response.data.length-1; i++){
              speed.push(response.data[i].speed);
          }
        }
      }else{
          speed.push(response.data[response.data.length-1].speed);
        }
      }, function(error){
        console.log('Something went wrong : ', error);
      });
    },
    queryWgt : function(uId){
      $http({
        method: 'GET',
        url: '/auth/weight/'+uId
      }).then(function(response){
        if(weight.length === 0){
          for(var i = response.data.length-8; i < response.data.length-1; i++){
            weight.push(response.data[i].weight);
          }
        }else{
          weight.push(response.data[response.data.length-1].weight);
        }
      }, function(error){
        console.log('Something went wrong : ', error);
      });
    }
  };
}])
