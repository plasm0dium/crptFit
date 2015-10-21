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

.controller('ProgressCtrl', ['$scope', function($scope) {
  $scope.chartConfig = {
      options: {
          chart: {
              type: 'line'
          }
      },
      series: [{
          data: [2, 16, 32, -5, 80]
      }],
      title: {
          text: ''
      },

      loading: false
  }
 }])

.controller('MessagesCtrl', [function() { }])

.controller('SocialCtrl', ['Social', function(Social) {
  var self = this;
  // Add a refreshing function here
  self.friends = Social.friendsList();

  self.showFriends = function(){

  };

  self.showClients = function(){

  };

  self.showTrainers = function(){

  }
}])
