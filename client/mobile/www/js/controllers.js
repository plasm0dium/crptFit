angular.module('crptFit.controllers', ['ionic'])

.controller('ViewProfileCtrl', ['$http', 'Social', function($http, Social){
  var self = this;
  self.pic;
  self.username;
  self.feed;            // PLEASE REFACTOR
  self.friendCount;
  self.trainerCount;
  self.clientCount;

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
    {username: 'Ricky Walker', update: 'Did 5000 squats!'}
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
   self.strong = {
     val: null
   };
   self.Strength = Progress.getStr();
   self.checkMe = function(){
     self.check = Progress.postStr(self.strong.val);
   };
   $scope.chartConfig = {
     options: {
       chart: {
         type: 'spline'
       }
     },
     series: [{
       data: self.Strength
     }],
     xAxis: {
       tickInterval: 5
     },
     title: {
       text: ''
     },
     loading: false
    };
  }])
// Start of Progress Speed Controller =======================================================
  .controller('ProgressCtrlSpd', ['$scope', 'Progress', function($scope, Progress) {
    var self = this;
    self.timeSpd = {
      val: null
    };
    self.distance={
      val: null
    };
    self.Speed = Progress.getSpd();
    self.checkMe = function(){
      self.check = Progress.postSpd(self.timeSpd.val, self.distance.val);
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
  .controller('ProgressCtrlWgt', ['$scope', 'Progress', function($scope, Progress) {
    var self = this;
    self.weight = {
      val: null
    };
    self.Weight = Progress.getWgt();
    self.checkMe = function(){
      self.check = Progress.postWgt(self.weight.val);
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
.controller('ProgressCtrlTask', ['Task', function(Task){
  var self = this;
  self.tasks = Task.taskFunc();
  self.toggle = function(task){
    task.toggled = !task.toggled;
  };
  self.finishTask = function(task){
    self.finish = Task.finishTask(task);
  };
}])

.controller('MessagesCtrl', ['$scope', '$ionicPopup', 'Message', 'Social', function($scope, $ionicPopup, Message, Social) {
//NOTE Refactor me
  var self = this;

  self.search = Social.friendsList();

  self.showMessageContent = function(){
    Message.captureMessages();
  };
  self.clearContent = function(){
    console.log('why cap no null')
      Message.clearCap();
  };
  self.showMessages = function(){
   Message.getMessage();
  };

  self.messageToPage = Message.messageList();

  self.searchFriends = function(){
    self.search = Social.friendsList();
  };

  self.capture = Message.capturedChatID();
  self.captureMessages = Message.captureMessages();

  self.makeChat = function(userId){
    console.log('clicked');
    // Message.getFriendIds();
    self.chat = Message.makeChat(userId);
  };
  self.sendMessage = function(chatId, val){
    self.send = Message.sendMessage(chatId, val);
     self.sendTo.val = null;
  };
  self.capChatId = function(chatId){
    Message.getRoom(chatId);
  };

  // self.messageCapture = Message.getMessageContent(Message.capChat);

  $scope.showPopup = function() {
  $scope.data = {};
  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    template: '<div ng-controller="MessagesCtrl as ctrl"><div ng-init="ctrl.searchFriends()"><div ng-repeat="friend in ctrl.search"><a class="item item-avatar" ng-click="ctrl.makeChat(friend.id)" href="#/tab/message>{{friend.username}}</a></div></div></div>',
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
.controller('SocialCtrl', ['$scope', '$ionicPopup','Social', function($scope, $ionicPopup, Social) {
  var self = this;
  // Add a refreshing function here
  self.list = Social.friendsList();

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
      self.list = Social.searchResultsList(res);
    });
  };

}])
