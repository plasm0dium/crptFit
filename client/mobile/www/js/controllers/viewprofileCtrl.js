angular.module('crptFit')
// Start of VIEW PROFILE CTRL =================================================
//=============================================================================
.controller('ViewProfileCtrl', ['$http', 'Social', 'User', function($http, Social, User){
  var viewedUser = this;
  var userObj = User.getUserObject();
  // Variables for the viewed user profile
  viewedUser.userID = Social.getUserID();
  viewedUser.friendCount;
  viewedUser.username;
  viewedUser.pic;
  viewedUser.feed;

  // Variable that controls the disabled state of the 'add friend' button
  viewedUser.isFriend = false;

  // Check to see if the viewed user is your friend
  userObj.then(function(response){
    for(var i = 0; i < response.data.friends.length; i++){
      if(response.data.friends[i].friends_id === viewedUser.userID){
        viewedUser.isFriend = true;
      }
    }
  });

  // Send the viewed user a friend request
  viewedUser.sendFriendRequest = function(){
    $http({
      method: 'POST',
      url: '/auth/friendreq/' + viewedUser.userID
    });
  };

  // Utility function for setting a viewed user's properties for rendering
  var setProfileInfo = function(picUrl, username, friends, activityFeed){
    viewedUser.friendCount = friends;
    viewedUser.username = username;
    viewedUser.feed = activityFeed;
    viewedUser.pic = picUrl;
  };

  // Return a user's completed tasks
  var setTasks = function(tasks){
    var filtered = [];
    for(var i = 0; i < tasks.length; i++){
      if(tasks[i].complete === 1){
        filtered.push(tasks[i]);
      }
    }
    return filtered;
  };

  // Request the viewed user's object from the server and capture needed properties
  $http({
    method: 'GET',
    url: '/auth/user/' + Social.getUserID() // This self.savedID variable is passed down from the parent controller 'Social Ctrl'
  }).then(function(response){
    var friends = response.data.friends.length;
    var tasks = setTasks(response.data.tasks);
    var userName = response.data.username;
    var pic = response.data.profile_pic;

    setProfileInfo(pic, userName, friends, tasks);
  });
}])