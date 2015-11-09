angular.module('crptFit')
// Start of SOCIAL FACTORY ====================================================
//=============================================================================

.factory('Social', ['$http', function($http){

  var friends = [];
  var matches = [];
  var searchResults = [];
  var savedUserID;
  var friendsPendingRequest = [];

  return {
    userViewerSet: function(userID){
      savedUserID = userID;
    },
    getUserID: function(){
      return savedUserID;
    },
    friendsList: function(){
      $http({
        method: 'GET',
        url: '/auth/friends'
      })
      .then(function(response){
        friends = response.data;
      }, function(error){
        console.log(error);
      });
      return friends;
    },
    getFriendsLength: function(){
      return friends.length;
    },
    getFriendRequests: function() {
      return $http({
        method: 'GET',
        url: '/auth/friendrequests'
      });
    },
    addFriend: function(friendId){
      // This function needs the proper AJAX request
      $http({
        method: 'POST',
        url: '/auth/friends/add:' + friendId
      });
      this.friendsList();
    },
    matchesList: function () {
      $http({
        method: 'GET',
        url: '/auth/getmatches'
      })
      .then(function(response) {
        matches = response.data
      }, function(error) {
        console.log(error)
      });
      return matches
    },
    searchResultsList: function(username){
      $http({
        method: 'GET',
        url: '/auth/search/' + username
      })
      .then(function(response){
        return response.data;
      }).then(function(response){
        searchResults = response;
        return searchResults;
      });
    },
    updateBio: function(bio) {
      $http({
        method: 'POST',
        url: '/auth/updateprofile',
        data: {
          profile: bio
        }
      })
    }
  };
}])