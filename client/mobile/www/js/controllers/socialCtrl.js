angular.module('crptFit')
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

  self.removeFriended = function(person){
    self.reqlist.splice(self.reqlist.indexOf(person), 1);
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
      return self.showSearchResults(res);
    });
  };

}])