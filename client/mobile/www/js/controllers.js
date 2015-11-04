angular.module('crptFit.controllers', ['ionic'])

.controller('ViewProfileCtrl', ['$http', 'Social', function($http, Social){
  console.log("instantiated ViewProfileCtrl");
  var self = this;
  self.pic;
  self.username;
  self.feed;            // PLEASE REFACTOR
  self.friendCount;
  self.trainerCount;
  self.clientCount;
  self.isFriend;
  self.requested;
  self.userID = Social.getUserID();

  self.sendFriendRequest = function(){
    $http({
      method: 'POST',
      url: '/auth/friendreq/' + self.userID
    }).then(function(response){
    console.log("CONSOLE LOG FRIEND SEQUENCE", response.data);
      
    })
  };

  self.sendClientRequest = function(){
    $http({
      method: 'POST',
      url: '/auth/clientreq/add:' + self.userID
    })
  };

  var setProfileInfo = function(picUrl, username, friends, trainers, clients, activityFeed){
    self.pic = picUrl;
    self.username = username;
    self.friendCount = friends;
    self.trainerCount = trainers;
    self.clientCount = clients;
    self.feed = activityFeed;
  }
  var setTasks = function(tasks){
    var filtered = [];
    for(var i = 0; i < tasks.length; i++){
      if(tasks[i].complete === 1){
        filtered.push(tasks[i]);
      }
    }
    return filtered;
  }

  $http({
    method: 'GET',
    url: '/auth/user/' + Social.getUserID() // This self.savedID variable is passed down from the parent controller 'Social Ctrl'
  }).then(function(response){
    console.log("WHAT IS THIS", response.data);
    var pic = response.data.profile_pic;
    var userName = response.data.username;
    var friends = response.data.friends.length;
    var trainers = response.data.trainers.length;
    var clients = response.data.clients.length;
    var tasks = setTasks(response.data.tasks);
    setProfileInfo(pic, userName, friends, trainers, clients, tasks);
  })

}])
// Start of Profile Controller =======================================================
.controller('ProfileCtrl', ['Social', '$http', function(Social, $http) {

  var self = this;
  self.pic;
  self.username;
  self.feed;
  self.Id;

  self.friendCount = Social.getFriendsLength();
  self.trainerCount = Social.getTrainersLength();
  self.clientCount = Social.getClientsLength();
  // Helper function for extracting profile info dynamically and setting it in the controller
  var setUserInfo = function(picUrl, username, id){
     self.pic = picUrl;
     self.username = username;
     self.Id = id;
  };

  var setTasks = function(tasks){
    var filtered = [];
    for(var i = 0; i < tasks.length; i++){
      if(tasks[i]){
        filtered.push(tasks[i]);
      }
    }
    self.feed = filtered;
  }
  // Grab a users tasks - extract into a factory later
  $http({
    method: 'GET',
    url: '/auth/usertask/' + self.Id
  }).then(function(response){
    setTasks(response.data);
  })
  // Grab a users profile information - extract into a factory later
  $http({
    method: 'GET',
    url: '/auth/user'
  }).then(function(response){
    console.log("this is the user object:", response.data);
    var picUrl = response.data.profile_pic;
    var userName = response.data.username;
    var currentUserId = response.data.id;
    setUserInfo(picUrl, userName, currentUserId);
  });
  // Add a refreshing function here
 }])
// Start of HomeCtrl Controller =======================================================
.controller('HomeCtrl', ['Social', '$http', 'User', 'Finder', function(Social, $http, User, Finder) {
  var self = this;
  self.feed = [];
  self.user;

  self.initialize = function(){
    Social.friendsList();
    Social.clientsList();
    Social.trainersList();
    $http({
      method: 'get',
      url: '/auth/newsfeed'
    }).then(function(response){
      self.feed = response.data;
    })
  }
  self.initialize();

 }])
// Start of Progress Controller =======================================================
.controller('ProgressCtrl', ['$scope', 'Progress', function($scope, Progress) {
  var self = this;
 }])
  .controller('ProgressCtrlStr', ['$scope', 'Progress', function($scope, Progress) {
    var self = this;
  }])
// Start of Progress Benchpress Controller ==================================================
  .controller('ProgressCtrlBench', ['$scope', '$http', 'Progress', 'Social', function($scope, $http, Progress, Social){
    var self = this;
    self.pushMe =  function(){
      Progress.pushBnch(self.benchData.weight);
      Progress.postBnch(self.benchData.weight);
      self.benchData.weight = null;
    };
    self.getUid = function(){
        $http({
          method: 'GET',
          url: '/auth/user'
        }).then(function(response){
          console.log(response, 'THIS IS THE USER OBJ')
        self.uId = response.data.id;
        self.checkMe(self.uId);
        });
    };
    self.uId = null;
    self.getUid();
    self.benchData = {
         weight: null,
         reps: null,
       };
       self.Bench = Progress.getBnch();

       self.checkMe = function(val){
         self.benchData.weight = null;
         Progress.queryBnch(val);
         self.Bench = Progress.getBnch();
       };
       $scope.chartConfig = {
         options: {
           chart: {
             type: 'spline'
           }
         },
         series: [{
           data: self.Bench
         }],
         title: {
           text: 'Benchpress'
         },
         loading: false
        };
  }])
// Start of Progress Deadlift Controller ====================================================
  .controller('ProgressCtrlDead', ['$scope','$http', 'Progress', function($scope, $http, Progress){
    var self = this;
    self.pushMe =  function(){
      Progress.pushDed(self.deadData.weight);
      Progress.postDed(self.deadData.weight);
      self.deadData.weight = null;
    };
    self.getUid = function(){
        $http({
          method: 'GET',
          url: '/auth/user'
        }).then(function(response){
        self.uId = response.data.id;
        self.checkMe(self.uId);
        });
    };
    self.uId = null;
    self.getUid();
    self.deadData = {
         weight: null,
         reps: null,
       };
       self.Dead = Progress.getDed();

       self.checkMe = function(val){
         self.deadData.weight = null;
         Progress.queryDed(val);
         self.Dead = Progress.getDed();
       };
       $scope.chartConfig = {
         options: {
           chart: {
             type: 'spline'
           }
         },
         series: [{
           data: self.Dead
         }],
         title: {
           text: 'Deadlift'
         },
         loading: false
        };
  }])
// Start of Progress Squat Controller =======================================================
.controller('ProgressCtrlSquats', ['$scope', '$http', 'Progress', function($scope, $http, Progress){
  var self = this;
  self.pushMe =  function(){
    Progress.pushSqu(self.squatData.weight);
    Progress.postSqu(self.squatData.weight);
    self.squatData.weight = null;
  };
  self.getUid = function(){
      $http({
        method: 'GET',
        url: '/auth/user'
      }).then(function(response){
      self.uId = response.data.id;
      self.checkMe(self.uId);
      });
  };
  self.uId = null;
  self.getUid();
  self.squatData = {
       weight: null,
       reps: null,
     };
     self.Squat = Progress.getSqu();

     self.checkMe = function(val){
       self.squatData.weight = null;
       Progress.querySqu(val);
       self.Squat = Progress.getSqu();
     };
     $scope.chartConfig = {
       options: {
         chart: {
           type: 'spline'
         }
       },
       series: [{
         data: self.Squat
       }],
       title: {
         text: 'Squats'
       },
       loading: false
      };
}])
// Start of Progress Speed Controller =======================================================
  .controller('ProgressCtrlSpd', ['$scope', '$http', 'Progress', function($scope, $http, Progress) {
    var self = this;
    self.pushMe =  function(){
      Progress.pushSpd((self.distance.val/self.timeSpd.val)*60);
      Progress.postSpd((self.distance.val/self.timeSpd.val)*60);
      self.distance.val = null;
      self.timeSpd.val = null;
      Progress.getSpd();
    };
    self.timeSpd = {
      val: null
    };
    self.distance={
      val: null
    };
    self.getUid = function(){
        $http({
          method: 'GET',
          url: '/auth/user'
        }).then(function(response){
        self.uId = response.data.id;
        self.checkMe(self.uId);
        });
    };
    self.uId = null;
    self.getUid();
    self.Speed = Progress.getSpd();
    self.checkMe = function(val){
      self.timeSpd.val = null;
      self.distance.val = null;
      Progress.querySpd(val);
      self.Speed = Progress.getSpd();
    };
    $scope.chartConfig = {
      options: {
        chart: {
          type: 'spline'
        }
      },
      series: [{
        data: self.Speed
      }],
        title: {
          text: ''
        },
        loading: false
    };
  }])
// Start of Progress Weight Controller =======================================================
  .controller('ProgressCtrlWgt', ['$scope', '$http', 'Progress', function($scope, $http, Progress) {
    var self = this;
    self.pushMe =  function(){
      Progress.pushWgt(self.weight.weight);
      Progress.postWgt(self.weight.weight);
      self.weight.weight = null;
    };
    self.getUid = function(){
        $http({
          method: 'GET',
          url: '/auth/user'
        }).then(function(response){
        self.uId = response.data.id;
        self.checkMe(self.uId);
        });
    };
    self.uId = null;
    self.getUid();
    self.weight = {
         weight: null,
       };
       self.Weight = Progress.getWgt();

       self.checkMe = function(val){
         self.weight.weight = null;
         Progress.queryWgt(val);
         self.Weight = Progress.getWgt();
       };
    $scope.chartConfig = {
      options: {
        chart: {
          type: 'spline'
        }
      },
      series: [{
        data: self.Weight
      }],
      title: {
        text: ''
      },
      loading: false
    };
  }])
// Start of Progress Task Controller =======================================================
.controller('ProgressCtrlTask', ['Tasks', function(Tasks){
  var self = this;
  self.createTask = function(val){
    Tasks.addTaskToSelf(val);
    Tasks.getTaskHolder(val);
    self.sendTo.val = null;
  };
  self.sendTo = {
    val : null
  };
  self.startTasks = function(){
    self.tasks = Tasks.getTasksList();
  };
  self.toggle = function(task){
    task.toggled = !task.toggled;
  };
  self.finishTask = function(taskId, task){
    self.finish = Tasks.finishTask(taskId, task);
  };
}])

.controller('MessagesCtrl', ['$scope','$state', '$location', '$ionicPopup', 'Message', 'Social', function($scope, $state, $location, $ionicPopup, Message, Social) {
//NOTE Refactor me
  var self = this;
  self.sendTo = {
    val: null
  }
  self.search = Social.friendsList();

  self.getFriends = function(){
    Message.getFriends();
  };
  self.showId =function(val){
    Message.capturedChatID(val);
  };
  self.showMessageContent = function(){
    Message.captureMessages();
  };

  self.showMessages = function(){
    Message.getMessage();
  };

  Message.messageList();

  self.messageToPage = Message.captureMessages();

  self.returnMessage = Message.messageToPage();

  self.getMessagesById = function(){
    self.sendHelp = Message.clearCap();
  };

  self.captureMessages = Message.messageList();
  self.makeChat = function(userId){
    $scope.myPopup.close();
    self.chat = Message.makeChat(userId);
    $state.go($state.current, {}, {reload: true});
  };
  self.sendMessage = function(chatId, val){
    console.log(chatId, val)
    self.send = Message.sendMessage(chatId, val);
      Message.messageUpdate(val)
     self.sendTo.val = null;
     self.returnMessage = Message.messageToPage();
  };
  self.capChatId = function(chatId){
    Message.getRoom(chatId);
  };

  self.connect = function(id){
    var socket = io();
    console.log(id, 'this is what im passing')
    console.log('LOOKING TO CONNECTION')
    socket.emit('connecting', id)
     socket.on('message-append', function(id, message){
      console.log(id, message)
        self.sendMessage(id, message)
      })
     $scope.$on('$destroy', function(event){
      console.log('the dc event actually fired', id)
      socket.emit('leave', id)
     })
  };
  self.liveUpdate = function(chatId, message){
    var socket = io();
      socket.emit('chatroom id', chatId, message);
    };
  $scope.showPopup = function() {
  $scope.data = {};
   $scope.myPopup = $ionicPopup.show({
    template: '<div ng-controller="MessagesCtrl as ctrl"><div ng-init="ctrl.getFriends()"><div ng-repeat="friend in ctrl.search"><a class="item" ng-click="ctrl.makeChat(friend.id)">{{friend.username}}</a></div></div></div>',
    title: 'Create a message',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
    ]
  });
  $scope.myPopup.then(function(res) {
    console.log('Tapped!', res);
    self.list = Social.searchResultsList(res);
  });
 };
}])
// Start of Social Controller =======================================================
.controller('SocialCtrl', ['$scope', '$ionicPopup','Social', '$http', function($scope, $ionicPopup, Social, $http) {
  var self = this;
  // Add a refreshing function here
  Social.friendsList();
  self.list = Social.friendsList();
  self.reqlist;

  self.showRequests = function(){
    self.list = [];
    self.reqlist = [];
    var friendRequests = Social.getFriendRequests();
    friendRequests.then(function(response){
      console.log("CONSOLE>LOG THIS IS FRIEND REQUESTS", response)
      var filtered = [];
      response.data.forEach(function(obj){
        if(obj) {filtered.push(obj);}
      });
      self.reqlist = filtered;
      console.log("SOCIAL CONTR", self.reqlist);
    })
  }

  self.acceptFriend = function(friendId){
      $http({
        method: 'POST',
        url: '/auth/confirmfriend/' + friendId
      })
      .then(function(){
        self.reqlist = [];
        self.showRequests();
      });
  }

  self.showSearchResults = function(username){
    $http({
        method: 'GET',
        url: '/auth/search/' + username
      })
      .then(function(response){
        console.log("inside of the service calling SRL:", response.data)
        return response.data;
      }).then(function(response){
        console.log("final part of SRL from service:", response);
        self.list = response;
      });
  }
  self.saveUserID = function(facebookID){
    console.log("inside of SaveUserID", facebookID);
    Social.userViewerSet(facebookID);
  }
  self.showFriends = function(){
    self.reqlist = [];
    self.list = Social.friendsList();
    console.log(self.list);
  };
  self.showClients = function(){
    self.reqlist = [];
    self.list = Social.clientsList();
  };
  self.showTrainers = function(){
    self.reqlist = [];
    self.list = Social.trainersList();
  }
  $scope.showPopup = function(){
    $scope.data = {};
    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: '<form><input type="text" ng-model="data.wifi"></form>',
      title: 'Search for a user',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Search</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.wifi) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              return $scope.data.wifi;
            }
          }
        }
      ]
    });
    myPopup.then(function(res) {
      console.log('Tapped!', res);
      return self.showSearchResults(res);
    })
  };

}])

.controller('CardsCtrl',['$http','Finder', '$ionicLoading','$ionicPopup', function($http, Finder, $ionicLoading, $ionicPopup) {
  var self = this;
  self.cards = [];
  self.cardsLoaded = false;
  self.lat;
  self.lng;
  self.loading = $ionicLoading.show({
          template: '<p class="loading-text">Finding Nearby Users...</p><ion-spinner icon="ripple"></ion-spinner>',
        });


  self.getLocation = function () {
    navigator.geolocation.getCurrentPosition(function(position) {
    self.lat = position.coords.latitude;
    self.lng = position.coords.longitude;
    Finder.postUsersLocation(self.lat, self.lng);
    $ionicLoading.hide();
    self.addCards();
    }, function(error) {
      alert('Unable to get location: ' + error.message);
      });
    };
    // self.getLocation();

  // self.storeUserLoc = function () {
  //   Finder.postUsersLocation(self.lat, self.lng);
  // };

  self.addCard = function(image, username, id) {
    var newCard;
    newCard = {
      'image': image,
      'name' : username,
      'id' : id
    };
    self.cards.unshift(angular.extend({}, newCard));
    };

 self.addCards = function() {
     $http.get('/auth/nearbyusers').then(function(users) {
       self.cardsLoaded = true;
       console.log(users.data)
       if(users.data.nearbyUsers === 'None') {
         alert('Cannot find new users in your area')
       }
       else {
         console.log('THIS IS SWOLE PATROL', users)
       angular.forEach(users.data, function(card) {
         console.log('THIS IS CARD', card)
         if(card[0] === null) {
           return
         } else {
         self.addCard(card[0].profile_pic, card[0].username, card[0].id);
         console.log('THESE ARE CARDS', self.cards)
       }
       });
     }
     });
   };
  self.cardLike = function(card) {
    Finder.onRightSwipe(self.cards[0].id)
      $http.get('/auth/matchcheck/' + self.cards[0].id).then(function(response) {
        console.log('THIS IS RESPONSE FROM matchCheck', response)
        if(response.data.match === true) {
          $ionicPopup.alert({
            title: 'You\'ve Found a Match!',

            cssClass: 'matchPopup'
            //template: '<div class="popupImage"><img src="https://developer.apple.com/watch/human-interface-guidelines/icons-and-images/images/icon-and-image-large-icon-fitness.png"></div>'
     });
        } else {
          console.log('NO MATCH!')
          return
        }
      })
  };

    self.cardDislike = function(card) {
      Finder.onLeftSwipe(self.cards[0].id)
    };

    self.removeCard = function($index) {
      self.cards.splice($index, 1);
    };
  self.find = Finder.getUsers();

}])
