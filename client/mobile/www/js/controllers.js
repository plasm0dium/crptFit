angular.module('crptFit.controllers', ['ionic'])


.controller('ProfileCtrl', ['Social', '$http', function(Social, $http) {

  var self = this;
  self.pic;
  self.username;
  var setUserInfo = function(picUrl, username){
     self.pic = picUrl;
     self.username = username;
  }

  $http({
    method: 'GET',
    url: '/auth/picture'
  }).then(function(response){
    console.log("this is the request object for a user", response.data.profile_pic);
      var picUrl = response.data.profile_pic;
      var userName = response.data.username;
    console.log("this is the request object for a user", response.data.username);
      setUserInfo(picUrl, userName);
  });
  // Add a refreshing function here
  self.friendCount = Social.getFriendsLength();
  self.trainerCount = Social.getTrainersLength();
  self.clientCount = Social.getClientsLength();

  self.feed = [
    {username: 'Ricky Walker', update: 'Did 5000 squats!'},
    {username: 'Ricky Walker', update: 'Did 5000 squats!'},
    {username: 'Ricky Walker', update: 'Did 5000 squats!'}
  ];
 }])
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
.controller('MenuCtrl', [function() { }])
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
.controller('ProgressCtrlTask', ['Task', function(Task){
  var self = this;
  self.tasks = Task.taskFunc();
  self.toggle = function(task){
    task.toggled = !task.toggled;
  };
  self.finishTask = function(task){
    self.finish = Task.finishTask(task);
  }
}])
.controller('MessagesCtrl', ['Message', function(Message) {
  var self = this;
  self.makeChat = function(userId){
    console.log('clicked')
    Message.getFriendIds();
    self.chat = Message.makeChat(userId);
  }
}])
.controller('SocialCtrl', ['$scope', '$ionicPopup','Social', function($scope, $ionicPopup, Social) {
  var self = this;
  // Add a refreshing function here
  console.log("LIST OF FRIENDS", self);
  self.list = Social.friendsList();

  self.showFriends = function(){
    self.list = Social.friendsList();
  };

  self.showClients = function(){
    self.list = Social.clientsList();
  };

  self.showTrainers = function(){
    self.list = Social.trainersList();
  }

  $scope.showPopup = function() {
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
