angular.module('crptFit')
// Start of MESSAGES CTRL =====================================================
//=============================================================================

.controller('MessagesCtrl', ['$scope','$state', '$location', '$ionicPopup', 'Message', 'Social', 'User', '$ionicScrollDelegate', function($scope, $state, $location, $ionicPopup, Message, Social, User, $ionicScrollDelegate) {
  var self = this;
  var userObj = User.getUserObject();

  Message.messageList();

  self.sendTo = {
    val: null
  };

  self.search = Social.friendsList();
  self.userImg;
  self.friendImg = Message.getFriends();
  self.messageToPage = Message.captureMessages();
  self.returnMessage = Message.messageToPage();
  self.captureMessages = Message.messageList();


  userObj.then(function(response){
    self.userImg = response.data.profile_pic;
  });
  //Returns users friends on the current page
  self.getFriends = function(){
    Message.getFriends();
  };
  //Captures chat room id for comparison with chatstores
  self.showId =function(val){
    Message.capturedChatID(val);
  };

  self.showMessageContent = function(){
    Message.captureMessages();
  };

  self.showMessages = function(){
    Message.getMessage();
  };

  self.getMessagesById = function(){
    self.sendHelp = Message.clearCap();
  };
  //Creates a new chatroom, closes friend popup, and forces a page reload so the new chat is immediately ready to use
  self.makeChat = function(userId){
    $scope.myPopup.close();
    self.chat = Message.makeChat(userId);
    $state.go($state.current, {}, {reload: true});
  };
  //Posts message to database under correct chatId for retrieval, pushes message data and user image to retrun array for immediate render
  self.sendMessage = function(chatId, val){
    self.send = Message.sendMessage(chatId, val);
    Message.messageUpdate(val);
    self.sendTo.val = null;
    self.returnMessage = Message.messageToPage();
    $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
  };

  self.capChatId = function(chatId){
    Message.getRoom(chatId);
  };
  //Called on page load, connects user to a chat room socket defined by the chatId, any user with chatID relation can join this room
  //NOTE Refactor for group chat
  self.connect = function(id){
    var socket = io();
    socket.emit('connecting', id);
    socket.on('message-append', function(id, message){
      self.sendMessage(id, message);
      $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
    });

    $scope.$on('$ionicView.leave', function(event){
      socket.emit('disconnect', id);
    });
  };

  //Sends message to socket connection in server to relay message content to all users in the socket room for live message update
  self.liveUpdate = function(chatId, message){
    var socket = io();
    socket.emit('chatroom id', chatId, message);
  };

  //Opens separate window with friends list to create new chats
  $scope.showPopup = function() {
    $scope.data = {};
    $scope.myPopup = $ionicPopup.show({
      template: '<div ng-controller="MessagesCtrl as ctrl"><div ng-init="ctrl.getFriends()"><div ng-repeat="friend in ctrl.search"><a class="item" ng-click="ctrl.makeChat(friend.id)">{{friend.username}}</a></div></div></div>',
      title: 'Create a message',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
      ]
    });
    $scope.myPopup.then(function(res) {
      console.log('Tapped!', res);
      self.list = Social.searchResultsList(res);
    });
  };
}])