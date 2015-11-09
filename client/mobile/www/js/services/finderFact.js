angular.module('crptFit')
// Start of MATCHES FACTORY ===================================================
//=============================================================================

.factory('Finder', ['$http', '$q', '$window', function($http, $q, $window) {
  var nearbyUsers = [];
  var userLat;
  var userLng;
  return {
    returnMyLat: function () {
      return userLat;
    },
    returnMyLng: function () {
      return userLng;
    },
    matchCheck: function (userId) {
      $http({
        method: 'GET',
        url: 'auth/matchcheck' + userId
      }).then(function (response) {

      });
    },
    postUsersLocation: function(latitude, longitude) {
      console.log('SERVICE LAT', latitude);
      console.log('SERVICE LNG', longitude);
      $http({
        method: 'POST',
        url: '/auth/location',
        data : {
          lat: latitude,
          lng: longitude
          }
        });
      },
    onLeftSwipe: function(userId) {
      $http({
        method: 'POST',
        url: 'auth/leftswipe/' + userId,
      });
    },
    onRightSwipe: function(userId) {
     $http({
       method: 'POST',
       url: 'auth/rightswipe/' + userId
     });
    },
    returnNearbyUsers: function () {
      return nearbyUsers;
    },
    getNearbyUsers: function() {
    $http({
      method: 'GET',
      url: '/auth/nearbyusers'
    })
    .then(function(response) {
      nearbyUsers.push(response.data);
    });
  },
    getUsers: function(){
      return nearbyUsers;
    }
};
}]);
