angular.module('crptFit.controllers', ['ionic'])

// Start of VIEW PROFILE CTRL =================================================
//=============================================================================

.controller('ViewProfileCtrl', ['$http', 'Social', 'User', function($http, Social, User){
  var viewedUser = this;
  var userObj = User.getUserObject();

  // Variables for the viewed user profile
  viewedUser.userID = Social.getUserID();
  viewedUser.friendCount;
  viewedUser.username;
  viewedUser.pic;
  viewedUser.feed;

  // Variable that controls the disabled state of the 'add friend' button
  viewedUser.isFriend = false;

  // Check to see if the viewed user is your friend
  userObj.then(function(response){
    for(var i = 0; i < response.data.friends.length; i++){
      if(response.data.friends[i].friends_id === viewedUser.userID){
        viewedUser.isFriend = true;
      }
    }
  });

  // Send the viewed user a friend request
  viewedUser.sendFriendRequest = function(){
    $http({
      method: 'POST',
      url: '/auth/friendreq/' + viewedUser.userID
    });
  };

  // Utility function for setting a viewed user's properties for rendering
  var setProfileInfo = function(picUrl, username, friends, activityFeed){
    viewedUser.friendCount = friends;
    viewedUser.username = username;
    viewedUser.feed = activityFeed;
    viewedUser.pic = picUrl;
  };

  // Return a user's completed tasks
  var setTasks = function(tasks){
    var filtered = [];
    for(var i = 0; i < tasks.length; i++){
      if(tasks[i].complete === 1){
        filtered.push(tasks[i]);
      }
    }
    return filtered;
  }

  // Request the viewed user's object from the server and capture needed properties
  $http({
    method: 'GET',
    url: '/auth/user/' + Social.getUserID() // This self.savedID variable is passed down from the parent controller 'Social Ctrl'
  }).then(function(response){
    var friends = response.data.friends.length;
    var tasks = setTasks(response.data.tasks);
    var userName = response.data.username;
    var pic = response.data.profile_pic;

    setProfileInfo(pic, userName, friends, trainers, clients, tasks);
  });
}])

// Start of PROFILE CTRL ======================================================
//=============================================================================

.controller('ProfileCtrl', ['Social', '$http', function(Social, $http){

  var userProfile = this;

  // Variables for the user profile
  userProfile.friendCount = Social.getFriendsLength();
  userProfile.username;
  userProfile.feed;
  userProfile.pic;
  userProfile.Id;

  // Helper function for setting profile info
  var setUserInfo = function(picUrl, username, id){
     userProfile.pic = picUrl;
     userProfile.username = username;
     userProfile.Id = id;
  };

  // Return a user's completed tasks
  var setTasks = function(tasks){
    var filtered = [];
    for(var i = 0; i < tasks.length; i++){
      if(tasks[i]){
        filtered.push(tasks[i]);
      }
    }
    userProfile.feed = filtered;
  }

  // Grab all of the logged in user's tasks - extract into a factory later
  $http({
    method: 'GET',
    url: '/auth/usertask/' + userProfile.Id
  }).then(function(response){
    setTasks(response.data);
  })

  // Request and set a user's profile information - extract into a factory later
  $http({
    method: 'GET',
    url: '/auth/user'
  }).then(function(response){
    var picUrl = response.data.profile_pic;
    var userName = response.data.username;
    var currentUserId = response.data.id;
    setUserInfo(picUrl, userName, currentUserId);
  });
}])

// Start of HOME CTRL =========================================================
//=============================================================================

.controller('HomeCtrl', ['Social', '$http', function(Social, $http){

  Social.friendsList();
  var homePage = this;

  homePage.feed = [];
  homePage.user;

  // Request the logged in user's news feed
  $http({
    method: 'get',
    url: '/auth/newsfeed'
  }).then(function(response){
    homePage.feed = response.data;
  });
}])

// Start of BENCHPRESS PROGRESS CTRL ==========================================
//=============================================================================

.controller('ProgressCtrlBench', ['$scope', '$http', 'Progress', 'Social', function($scope, $http, Progress, Social){

  var benchProgress = this;

  benchProgress.Bench = Progress.getBnch();
  benchProgress.benchData = {
    weight: null,
    reps: null,
  };

  benchProgress.pushMe = function(){
    Progress.pushBnch(benchProgress.benchData.weight);
    Progress.postBnch(benchProgress.benchData.weight);
    benchProgress.benchData.weight = null;
  };

  benchProgress.getUid = function(){
    $http({
      method: 'GET',
      url: '/auth/user'
    }).then(function(response){
      benchProgress.uId = response.data.id;
      benchProgress.checkMe(benchProgress.uId);
    });
  };

  benchProgress.checkMe = function(val){
    Progress.queryBnch(val);
    benchProgress.Bench = Progress.getBnch();
    benchProgress.benchData.weight = null;
  };

  benchProgress.uId = null;
  benchProgress.getUid();

  $scope.chartConfig = {
    options: {
      chart: {
        type: 'spline'
      }
    },
    series: [{
      data: benchProgress.Bench
      }],
    title: {
      text: 'Benchpress'
    },
    loading: false
  };
}])

// Start of DEADLIFT PROGRESS CTRL ============================================
//=============================================================================

.controller('ProgressCtrlDeadlift', ['$scope','$http', 'Progress', function($scope, $http, Progress){

  var deadliftProgress = this;

  deadliftProgress.pushMe =  function(){
    Progress.pushDed(deadliftProgress.deadData.weight);
    Progress.postDed(deadliftProgress.deadData.weight);
    deadliftProgress.deadData.weight = null;
  };

  deadliftProgress.getUid = function(){
      $http({
        method: 'GET',
        url: '/auth/user'
      }).then(function(response){
      deadliftProgress.uId = response.data.id;
      deadliftProgress.checkMe(deadliftProgress.uId);
      });
  };
  deadliftProgress.uId = null;
  deadliftProgress.getUid();
  deadliftProgress.deadData = {
       weight: null,
       reps: null,
     };
     deadliftProgress.Dead = Progress.getDed();

     deadliftProgress.checkMe = function(val){
       deadliftProgress.deadData.weight = null;
       Progress.queryDed(val);
       deadliftProgress.Dead = Progress.getDed();
     };
     $scope.chartConfig = {
       options: {
         chart: {
           type: 'spline'
         }
       },
       series: [{
         data: deadliftProgress.Dead
       }],
       title: {
         text: 'Deadlift'
       },
       loading: false
        };
  }])
// Start of Progress Squat Controller =======================================================
//=============================================================================

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
//=============================================================================

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
//=============================================================================

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
//=============================================================================

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

.controller('MessagesCtrl', ['$scope','$state', '$ionicPopup', 'Message', 'Social', function($scope,$state, $ionicPopup, Message, Social) {
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
  }
  self.liveUpdate = function(chatId, message){
    var socket = io();
      socket.emit('chatroom id', chatId, message);
    }
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
//=============================================================================

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
  self.showMatches = function () {
    self.reqlist = [];
    self.list = Social.matchesList();
  }
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
        $ionicPopup.alert({
          title: 'We Couldnt Find New Users in Your Area',
          template: 'Please Check Back Later',
          cssClass: 'matchPopup'
          //template: '<div class="popupImage"><img src="https://developer.apple.com/watch/human-interface-guidelines/icons-and-images/images/icon-and-image-large-icon-fitness.png"></div>'
        });
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

}])
