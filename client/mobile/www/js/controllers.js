angular.module('crptFit.controllers', [])

.controller('LoginCtrl', [function() { }])

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
  self.postStr = Progress.postStr();
 }])
 .controller('ProgressCtrlStr', ['$scope', 'Progress', function($scope, Progress) {
   var self = this;
   self.Strength = Progress.getStr();
   $scope.chartConfig = {
       options: {
           chart: {
               type: 'spline'
           }
       },
       series: [{
           data: self.Strength
       }],
       title: {
           text: ''
       },
       loading: false
   };
  }])
  .controller('ProgressCtrlSpd', ['$scope', 'Progress', function($scope, Progress) {
    var self = this;
    self.Speed = Progress.getSpd();
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
     self.Weight = Progress.getWgt();
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
