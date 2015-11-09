angular.module('crptFit')

// Start of USER FACTORY ======================================================
//=============================================================================
.factory('User', ['$http', function($http){

  // Return a promise, holding a user object, for controllers
  var getUserObject = function(){
    return $http({
      method: 'get',
      url: '/auth/user'
    });
  };

  return {
    getUserObject: getUserObject
  };
}])