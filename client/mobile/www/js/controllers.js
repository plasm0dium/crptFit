angular.module('crptFit.controllers', ['ionic'])

.controller('ViewProfileCtrl', ['$http', 'Social', function($http, Social){
  var self = this;
  self.pic;
  self.username;
  self.feed;            // PLEASE REFACTOR
  self.friendCount;
  self.trainerCount;
  self.clientCount;
  self.userID = Social.getUserID();
  console.log("inside ViewProfileCtrl:", self.userID)

  self.sendFriendRequest = function(){
    $http({
      method: 'POST',
      url: '/auth/friendreq/add:' + self.userID
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

  $http({
    method: 'GET',
    url: '/auth/user/' + Social.getUserID() // This self.savedID variable is passed down from the parent controller 'Social Ctrl'
  }).then(function(response){
    console.log("Inside ViewProfileCtrl:", response.data);
    var pic = response.data.profile_pic;
    var userName = response.data.username;
    var friends = response.data.friends.length;
    var trainers = response.data.trainers.length;
    var clients = response.data.clients.length;
    var tasks = response.data.tasks;
    setProfileInfo(pic, userName, friends, trainers, clients, tasks);
  })
}])
// Start of Profile Controller =======================================================
.controller('ProfileCtrl', ['Social', '$http', function(Social, $http) {

  var self = this;
  self.pic;
  self.username;
  self.feed;

  self.friendCount = Social.getFriendsLength();
  self.trainerCount = Social.getTrainersLength();
  self.clientCount = Social.getClientsLength();
  // Helper function for extracting profile info dynamically and setting it in the controller
  var setUserInfo = function(picUrl, username){
     self.pic = picUrl;
     self.username = username;
  };

  var setTasks = function(tasks){
    self.feed = tasks;
  }
  // Grab a users tasks - extract into a factory later
  $http({
    method: 'GET',
    url: '/auth/tasks'
  }).then(function(response){
    console.log("inside of the ProfileCtrl call:", response);
    setTasks(response.data);
  })
  // Grab a users profile information - extract into a factory later
  $http({
    method: 'GET',
    url: '/auth/picture'
  }).then(function(response){
    var picUrl = response.data.profile_pic;
    var userName = response.data.username;
    setUserInfo(picUrl, userName);
  });
  // Add a refreshing function here
 }])
// Start of HomeCtrl Controller =======================================================
.controller('HomeCtrl', ['Social', function(Social) {
  var self = this;
  // Add a refreshing function here
  Social.friendsList();
  Social.clientsList();
  Social.trainersList();
  self.feed = [
    {username: 'Ricky Walker', update: 'Did 5000 squats!'},
    {username: 'Ricky Walker', update: 'Did 5000 squats!'},
    {username: 'Ricky Walker', update: 'Did 5000 squats!'},
    {username: 'Ricky Walker', update: 'Did 5000 squats!'},
  ];
 }])
// Start of Menu Controller =======================================================
.controller('MenuCtrl', [function() { }])
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
       console.log('i fired!')
        $http({
          method: 'GET',
          url: '/auth/picture'
        }).then(function(response){
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
          url: '/auth/picture'
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
        url: '/auth/picture'
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
          url: '/auth/picture'
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
          url: '/auth/picture'
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

.controller('MessagesCtrl', ['$scope', '$ionicPopup', 'Message', 'Social', function($scope, $ionicPopup, Message, Social) {
//NOTE Refactor me
  var self = this;

  self.showId =function(val){
    Message.capturedChatID(val);
  };
  self.search = Social.friendsList();
  self.showMessageContent = function(){
    Message.captureMessages();
  };
  // self.clearContent = function(){
  //   Message.clearCap();
  // };
  self.showMessages = function(){
   Message.getMessage();
  };
  Message.messageList();

  self.messageToPage = Message.captureMessages();

  self.returnMessage = Message.messageToPage();

  self.getMessagesById = function(){
    self.sendHelp = Message.clearCap();
  };

  self.searchFriends = function(){
    self.search = Social.friendsList();
  };

  self.captureMessages = Message.messageList();

  self.makeChat = function(userId){
    console.log('clicked');
    // Message.getFriendIds();
    self.chat = Message.makeChat(userId);
  };
  self.sendMessage = function(chatId, val){
    console.log(chatId)
    self.send = Message.sendMessage(chatId, val);
     self.sendTo.val = null;
     self.returnMessage = Message.messageToPage();
  };
  self.capChatId = function(chatId){
    Message.getRoom(chatId);
  };

  // self.messageCapture = Message.getMessageContent(Message.capChat);

  $scope.showPopup = function() {
  $scope.data = {};
  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    template: '<div ng-controller="MessagesCtrl as ctrl"><div ng-init="ctrl.searchFriends()"><div ng-repeat="friend in ctrl.search"><a class="item item-avatar" ng-click="ctrl.makeChat(friend.id)" href=#/tab/message>{{friend.username}}</a></div></div></div>',
    title: 'Create a message',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
    ]
  });
  myPopup.then(function(res) {
    console.log('Tapped!', res);
    self.list = Social.searchResultsList(res);
  });
 };
}])
// Start of Social Controller =======================================================
.controller('SocialCtrl', ['$scope', '$ionicPopup','Social', '$http', function($scope, $ionicPopup, Social, $http) {
  var self = this;
  // Add a refreshing function here
  self.list = Social.friendsList();

  var updateList = function(){
    console.log('inside of updateList', list);
    self.list = list;
  };

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
    self.list = Social.friendsList();
    console.log(self.list);
  };

  self.showClients = function(){
    self.list = Social.clientsList();
  };

  self.showTrainers = function(){
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
