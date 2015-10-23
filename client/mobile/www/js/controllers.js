angular.module('crptFit.controllers', [])

.controller('LoginCtrl', ['Utility', function(Utility) {

}])

.controller('ProfileCtrl', [function() {
  var self = this;
  // Add a refreshing function here
  self.feed = [
    {username: 'Ricky Walker', update: 'Did 5000 squats!'},
    {username: 'Ricky Walker', update: 'Did 5000 squats!'},
    {username: 'Ricky Walker', update: 'Did 5000 squats!'},
    {username: 'Ricky Walker', update: 'Did 5000 squats!'},
    {username: 'Ricky Walker', update: 'Did 5000 squats!'}
  ];
 }])
.controller('HomeCtrl', [function() {
  var self = this;
  // Add a refreshing function here
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
.controller('MessagesCtrl', ['Message', function(Message) {
  //post and get messages controls here
  var self = this;
  self.messages = Message.messageList();
  self.clickUser = Message.clickUser();
  self.userCli = Message.userMess();
  Message.clickUser();

  self.refreshMessages = function(){

  };
}])
.controller('SocialCtrl', ['Social', function(Social) {
  var self = this;
  // Add a refreshing function here
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
}])
