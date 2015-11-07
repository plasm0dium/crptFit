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
  };

  // Request the viewed user's object from the server and capture needed properties
  $http({
    method: 'GET',
    url: '/auth/user/' + Social.getUserID() // This self.savedID variable is passed down from the parent controller 'Social Ctrl'
  }).then(function(response){
    var friends = response.data.friends.length;
    var tasks = setTasks(response.data.tasks);
    var userName = response.data.username;
    var pic = response.data.profile_pic;

    setProfileInfo(pic, userName, friends, tasks);
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
  // Everyone needs a montage
  $('.eyeOf').on('click', function(){
    $('#eye').append('<audio controller loop src="survivor.mp3" autoplay="true"></audio>');
  })
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
    weight: null
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
        backgroundColor: '#000',
          type: 'spline',
          style: {
            fontFamily: 'serif',
            backgroundColor: '#FFFEFF'
          }
      }
    },
    xAxis: {
      gridLineColor: '#FFFEFF',
      gridLineDashStyle: 'solid',
      labels: {
        style: {
          "color": "#FFFEFF"
        }
      },
      title: {
        style: {
          "color": "#FFFEFF"
        }
      }
    },
    yAxis: {
      gridLineColor: '#FFFEFF',
      gridLineDashStyle: 'solid',
      labels: {
        style: {
          "color": "#FFFEFF"
        }
      },
      title: {
        style: {
          "color": "#FFFEFF"
        }
      }
    },
    series: [{
      data: benchProgress.Bench
    }],
    title: {
      text: 'Benchpress',
      style: {
        "color": "#FFFEFF"
      }
    },
    loading: false
  };
}])

// Start of DEADLIFT PROGRESS CTRL ============================================
//=============================================================================

.controller('ProgressCtrlDeadlift', ['$scope','$http', 'Progress', function($scope, $http, Progress){

  var deadliftProgress = this;

  deadliftProgress.Dead = Progress.getDed();
  deadliftProgress.uId = null;
  deadliftProgress.deadData = {
       weight: null
    };

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

  deadliftProgress.checkMe = function(val){
    deadliftProgress.deadData.weight = null;
    Progress.queryDed(val);
    deadliftProgress.Dead = Progress.getDed();
  };

  deadliftProgress.getUid();

  $scope.chartConfig = {
    options: {
      chart: {
        backgroundColor: '#000',
        type: 'spline',
        style: {
          fontFamily: 'serif',
          backgroundColor: '#FFFEFF'
        }
      }
    },
    xAxis: {
      gridLineColor: '#FFFEFF',
      gridLineDashStyle: 'solid',
      labels: {
        style: {
          "color": "#FFFEFF"
        }
      },
      title: {
        style: {
          "color": "#FFFEFF"
        }
      }
    },
    yAxis: {
      gridLineColor: '#FFFEFF',
      gridLineDashStyle: 'solid',
      labels: {
        style: {
          "color": "#FFFEFF"
        }
      },
      title: {
        style: {
          "color": "#FFFEFF"
        }
      }
    },
    series: [{
      data: deadliftProgress.Dead
    }],
    title: {
      text: 'Deadlift',
      style: {
        "color": "#FFFEFF"
      }
    },
    loading: false
  };
}])

// Start of SQUAT PROGRESS CTRL ===============================================
//=============================================================================

.controller('ProgressCtrlSquats', ['$scope', '$http', 'Progress', function($scope, $http, Progress){

  var squatProgress = this;

  squatProgress.Squat = Progress.getSqu();
  squatProgress.uId = null;
  squatProgress.squatData = {
    weight: null
  };

  squatProgress.pushMe = function(){
    Progress.pushSqu(squatProgress.squatData.weight);
    Progress.postSqu(squatProgress.squatData.weight);
    squatProgress.squatData.weight = null;
  };

  squatProgress.getUid = function(){
    $http({
      method: 'GET',
      url: '/auth/user'
    }).then(function(response){
      squatProgress.uId = response.data.id;
      squatProgress.checkMe(squatProgress.uId);
    });
  };

  squatProgress.checkMe = function(val){
    squatProgress.squatData.weight = null;
    Progress.querySqu(val);
    squatProgress.Squat = Progress.getSqu();
  };

  squatProgress.getUid();

  $scope.chartConfig = {
    options: {
      chart: {
        backgroundColor: '#000',
        type: 'spline',
        style: {
          fontFamily: 'serif',
          backgroundColor: '#FFFEFF'
        }
      }
    },
    xAxis: {
      gridLineColor: '#FFFEFF',
      gridLineDashStyle: 'solid',
      labels: {
        style: {
          "color": "#FFFEFF"
        }
      },
      title: {
        style: {
          "color": "#FFFEFF"
        }
      }
    },
    yAxis: {
      gridLineColor: '#FFFEFF',
      gridLineDashStyle: 'solid',
      labels: {
        style: {
          "color": "#FFFEFF"
        }
      },
      title: {
        style: {
          "color": "#FFFEFF"
        }
      }
    },
    series: [{
      data: squatProgress.Squat
    }],
    title: {
      text: 'Squats',
      style: {
        "color": "#FFFEFF"
      }
    },
    loading: false
  };
}])

// Start of SPEED PROGRESS CTRL ===============================================
//=============================================================================

.controller('ProgressCtrlSpd', ['$scope', '$http', 'Progress', function($scope, $http, Progress){

  var speedProgress = this;

  speedProgress.Speed = Progress.getSpd();
  speedProgress.timeSpd = {
    val: null
  };
  speedProgress.distance={
    val: null
  };
  speedProgress.uId = null;

  speedProgress.pushMe = function(){
    Progress.pushSpd((speedProgress.distance.val/speedProgress.timeSpd.val)*60);
    Progress.postSpd((speedProgress.distance.val/speedProgress.timeSpd.val)*60);
    speedProgress.distance.val = null;
    speedProgress.timeSpd.val = null;
    Progress.getSpd();
  };

  speedProgress.getUid = function(){
    $http({
      method: 'GET',
      url: '/auth/user'
    }).then(function(response){
      speedProgress.uId = response.data.id;
      speedProgress.checkMe(speedProgress.uId);
    });
  };

  speedProgress.checkMe = function(val){
    speedProgress.timeSpd.val = null;
    speedProgress.distance.val = null;
    Progress.querySpd(val);
    speedProgress.Speed = Progress.getSpd();
  };

  speedProgress.getUid();

  $scope.chartConfig = {
    options: {
      chart: {
        backgroundColor: '#000',
        type: 'spline',
        style: {
          fontFamily: 'serif',
          backgroundColor: '#FFFEFF'
        }
      }
    },
    xAxis: {
      gridLineColor: '#FFFEFF',
      gridLineDashStyle: 'solid',
      labels: {
        style: {
          "color": "#FFFEFF"
        }
      },
      title: {
        style: {
          "color": "#FFFEFF"
        }
      }
    },
    yAxis: {
      gridLineColor: '#FFFEFF',
      gridLineDashStyle: 'solid',
      labels: {
        style: {
          "color": "#FFFEFF"
        }
      },
      title: {
        style: {
          "color": "#FFFEFF"
        }
      }
     },
     series: [{
      data: speedProgress.Speed
    }],
    title: {
      text: 'Speed',
      style: {
        "color": "#FFFEFF"
      }
    },
    loading: false
  };
}])

// Start of WEIGHT PROGRESS CTRL ==============================================
//=============================================================================

.controller('ProgressCtrlWgt', ['$scope', '$http', 'Progress', function($scope, $http, Progress) {

  var weightProgress = this;

  weightProgress.uId = null;
  weightProgress.weight = {
    weight: null,
  };
  weightProgress.Weight = Progress.getWgt();

  weightProgress.pushMe = function(){
    Progress.pushWgt(weightProgress.weight.weight);
    Progress.postWgt(weightProgress.weight.weight);
    weightProgress.weight.weight = null;
  };

  weightProgress.getUid = function(){
    $http({
      method: 'GET',
      url: '/auth/user'
    }).then(function(response){
      weightProgress.uId = response.data.id;
      weightProgress.checkMe(weightProgress.uId);
    });
  };

  weightProgress.checkMe = function(val){
    weightProgress.weight.weight = null;
    Progress.queryWgt(val);
    weightProgress.Weight = Progress.getWgt();
  };

  weightProgress.getUid();

  $scope.chartConfig = {
    options: {
      chart: {
        backgroundColor: '#000',
        type: 'spline',
        style: {
          fontFamily: 'serif',
          backgroundColor: '#FFFEFF'
        }
      }
    },
    xAxis: {
      gridLineColor: '#FFFEFF',
      gridLineDashStyle: 'solid',
      labels: {
        style: {
          "color": "#FFFEFF"
        }
      },
      title: {
        style: {
          "color": "#FFFEFF"
        }
      }
    },
    yAxis: {
      gridLineColor: '#FFFEFF',
      gridLineDashStyle: 'solid',
      labels: {
        style: {
          "color": "#FFFEFF"
        }
      },
      title: {
        style: {
          "color": "#FFFEFF"
        }
      }
    },
    series: [{
      data:  weightProgress.Weight
    }],
    title: {
      text: 'Weight',
        style: {
          "color": "#FFFEFF"
        }
    },
    loading: false
  };
}])

// Start of TASKS CTRL ========================================================
//=============================================================================

.controller('ProgressCtrlTask', ['Tasks', function(Tasks){

  var tasksProgress = this;

  tasksProgress.sendTo = {
    val : null
  };

  tasksProgress.createTask = function(val){
    Tasks.addTaskToSelf(val);
    Tasks.getTaskHolder(val);
    tasksProgress.sendTo.val = null;
  };

  tasksProgress.startTasks = function(){
    tasksProgress.tasks = Tasks.getTasksList();
  };

  tasksProgress.toggle = function(task){
    task.toggled = !task.toggled;
  };

  tasksProgress.finishTask = function(taskId, task){
    self.finish = Tasks.finishTask(taskId, task);
  };
}])

// Start of MESSAGES CTRL =====================================================
//=============================================================================

.controller('MessagesCtrl', ['$scope','$state', '$location', '$ionicPopup', 'Message', 'Social', 'User', function($scope, $state, $location, $ionicPopup, Message, Social, User) {
  var self = this;
  var userObj = User.getUserObject();

  Message.messageList();

  self.sendTo = {
    val: null
  };

  self.search = Social.friendsList();
  self.userImg;
  self.friendImg = Message.getFriends();
  self.messageToPage = Message.captureMessages();
  self.returnMessage = Message.messageToPage();
  self.captureMessages = Message.messageList();


  userObj.then(function(response){
    self.userImg = response.data.profile_pic;
  })

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

  self.getMessagesById = function(){
    self.sendHelp = Message.clearCap();
  };

  self.makeChat = function(userId){
    $scope.myPopup.close();
    self.chat = Message.makeChat(userId);
    $state.go($state.current, {}, {reload: true});
  };

  self.sendMessage = function(chatId, val){
    self.send = Message.sendMessage(chatId, val);
    Message.messageUpdate(val);
    self.sendTo.val = null;
    self.returnMessage = Message.messageToPage();
  };

  self.capChatId = function(chatId){
    Message.getRoom(chatId);
  };

  self.connect = function(id){
    var socket = io();
    socket.emit('connecting', id)
    socket.on('message-append', function(id, message){
      self.sendMessage(id, message)
    })
    $scope.$on('$ionicView.leave', function(event){
      socket.emit('disconnect', id)
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

// Start of SOCIAL CTRL =======================================================
//=============================================================================

.controller('SocialCtrl', ['$scope', '$ionicPopup','Social', '$http', function($scope, $ionicPopup, Social, $http){

  var self = this;

  Social.friendsList();

  self.list = Social.friendsList();
  self.reqlist;

  self.showRequests = function(){
    self.reqlist = [];
    self.list = [];

    var friendRequests = Social.getFriendRequests();

    friendRequests.then(function(response){
      var filtered = [];
      response.data.forEach(function(obj){
        if(obj) {filtered.push(obj);}
      });
      self.reqlist = filtered;
    });
  };

  self.acceptFriend = function(friendId){
      $http({
        method: 'POST',
        url: '/auth/confirmfriend/' + friendId
      })
      .then(function(){
        self.reqlist = [];
        self.showRequests();
      });
  };

  self.showSearchResults = function(username){
    $http({
      method: 'GET',
        url: '/auth/search/' + username
      })
      .then(function(response){
        return response.data;
      }).then(function(response){
        self.list = response;
      });
  };

  self.saveUserID = function(facebookID){
    Social.userViewerSet(facebookID);
  };

  self.showFriends = function(){
    self.reqlist = [];
    self.list = Social.friendsList();
  };

  self.showMatches = function () {
    self.reqlist = [];
    self.list = Social.matchesList();
  };

  self.showClients = function(){
    self.reqlist = [];
    self.list = Social.clientsList();
  };

  self.showTrainers = function(){
    self.reqlist = [];
    self.list = Social.trainersList();
  };

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
    });
  };

}])

// Start of CARDS CTRL =======================================================
//=============================================================================

.controller('CardsCtrl',['$http','Finder', '$ionicLoading','$ionicPopup', function($http, Finder, $ionicLoading, $ionicPopup){

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
      if(users.data.nearbyUsers === 'None') {
        $ionicPopup.alert({
          title: 'We Couldnt Find New Users in Your Area',
          template: 'Please Check Back Later',
          cssClass: 'matchPopup'
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
