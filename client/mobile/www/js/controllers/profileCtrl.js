angular.module('crptFit')
// Start of PROFILE CTRL ======================================================
//=============================================================================

.controller('ProfileCtrl', ['Social', '$http', function(Social, $http){

  var userProfile = this;

  // Variables for the user profile
  userProfile.friendCount = Social.getFriendsLength();
  userProfile.username;
  userProfile.feed;
  userProfile.pic;
  userProfile.Id;
  userProfile.bio;
  userProfile.update = {
    val: null
  };

  //Edits the user's Bio which is viewable by other users
  userProfile.updateProfile = function(bio) {
    console.log('HIT update')
    Social.updateBio(bio)
    userProfile.bio = bio;
    userProfile.update.val = null
  };

  // Helper function for setting profile info
  var setUserInfo = function(picUrl, username, id, bio){
     userProfile.pic = picUrl;
     userProfile.username = username;
     userProfile.Id = id;
     userProfile.bio = bio
  };

  // Return a user's completed tasks
  var setTasks = function(tasks){
    var filtered = [];
    for(var i = 0; i < tasks.length; i++){
      if(tasks[i]){
        filtered.push(tasks[i]);
      }
    }
    userProfile.feed = filtered;
  }
  // Everyone needs a montage
  $('.eyeOf').on('click', function(){
    $('#eye').append('<audio controller loop src="survivor.mp3" autoplay="true"></audio>');
  })
  // Grab all of the logged in user's tasks - extract into a factory later
  $http({
    method: 'GET',
    url: '/auth/usertask/' + userProfile.Id
  }).then(function(response){
    setTasks(response.data);
  })

  // Request and set a user's profile information - extract into a factory later
  $http({
    method: 'GET',
    url: '/auth/user'
  }).then(function(response){
    var picUrl = response.data.profile_pic;
    var userName = response.data.username;
    var currentUserId = response.data.id;
    var userProfile = response.data.profile;
    setUserInfo(picUrl, userName, currentUserId, userProfile);
  });
}])