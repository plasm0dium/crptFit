angular.module('crptFit')
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