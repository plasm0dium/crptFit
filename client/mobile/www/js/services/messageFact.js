angular.module('crptFit')
// Start of MESSAGES FACTORY ====================================================
//=============================================================================

.factory('Message', ['$http', function($http){
  var messages = {};
  var messageReturn = [];
  var room_ids = {};
  var capChat;
  var friends = [];
  return {
    messageToPage : function(){
      newRet = messageReturn;
      return newRet;
    },
    //Sorts through the messages object and pulls out only messages and their associated data for the current chat room
    //The format of the array being pushed into the return array is [message, user_id, username, profile_pic]
    messageList : function(){
      messageReturn = [];
      for(var key in messages){
        if(messages[key][0] === parseInt(capChat)){
          messageReturn.push([key, messages[key][1], messages[key][2], messages[key][3], messages[key][4]]);
        }
      }
    },
    //Forces immediate visual update of chat, the null values could be replaced with user data 
    messageUpdate: function(mess){
      messageReturn.push([mess, null, null, null, true]);
    },
    // Helper function for storing the value of the current chat room through a view change
    clearCap: function(){
      return capChat;
    },
    capturedChatID: function(val){
      capChat = val;
    },
    // Returns an object for rendering a list of current chatrooms, the format is messageId: [username, creation_time, profile_pic]
    captureMessages: function(){
      console.log(room_ids, 'lets get to the crux of this')
      return room_ids;
    },
    makeChat: function(userId){
      $http({
        method: 'POST',
        url: '/auth/chat/add'+userId
      });
    },
    getFriends: function(){
      $http({
        method: 'GET',
        url: '/auth/friends'
      })
      .then(function(response){
        friends = response.data;
      }, function(error){
      });
      return friends;
    },
    // This function queries the database for the chatstore object and then compares its message stores against the friends data array
    // It sets up the direct addition of user data to message relations
    getMessage : function(){
      //NOTE refactor for lower time complexity - NEEDED
      //NOTE refactored for more time complexity, but more use, needs backend fix
      $http({
        method: 'GET',
        url: '/auth/chatsessions'
      }).then(function(response){
        console.log('response', response.data)
          response.data.forEach(function(messageParts){
            messageParts.chatstore.forEach(function(session){
              friends.forEach(function(friend){
                if(friend.id === session.user_id){
                  messageParts.message.forEach(function(innerMessage){
                    //Used on individual message pages
                    if(innerMessage.user_id === session.user_id){
                      //IF Friend
                      messages[innerMessage.text] = [messageParts.id, innerMessage.user_id, friend.username, friend.profile_pic, false];
                    }else{
                      //IF Myself
                      messages[innerMessage.text] = [messageParts.id, innerMessage.user_id, "Me", null, true]
                    }
                    //Used in the outer message list
                    room_ids[messageParts.id] = [friend.username, messageParts.created_at, friend.profile_pic];
                  });
                }
              });
            });
          });
      }, function(error){
        console.log(error);
      });
    },
    getRoom: function(chatId){
      capChat = chatId;
      $http({
        method: 'GET',
        url: '/auth/chat/get' + chatId
      })
    },
    sendMessage: function(id, val){
      $http({
        method: 'POST',
        url: '/auth/messages/add' + id,
        data: {message: val}
      }).then(function(data){
      }, function(error){
        console.log(error);
      });
    }
  };
}])
