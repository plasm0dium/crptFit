angular.module('crptFit')
// Start of CARDS CTRL =======================================================
//=============================================================================

.controller('CardsCtrl',['$http','Finder', '$ionicLoading','$ionicPopup', function($http, Finder, $ionicLoading, $ionicPopup){

  var self = this;

  self.cards = [];
  self.cardsLoaded = false;
  self.lat;
  self.lng;
  self.loading = $ionicLoading.show({
    template: '<p class="loading-text">Finding Nearby Users...</p><ion-spinner icon="ripple"></ion-spinner>',
  });


  self.getLocation = function () {
    navigator.geolocation.getCurrentPosition(function(position) {
    self.lat = position.coords.latitude;
    self.lng = position.coords.longitude;
    Finder.postUsersLocation(self.lat, self.lng);
    $ionicLoading.hide();
    self.addCards();
    }, function(error) {
      alert('Unable to get location: ' + error.message);
      });
  };

  self.addCard = function(image, username, id, profile) {
    var newCard;
    newCard = {
      'image': image,
      'name' : username,
      'id' : id,
      'profile': profile
    };
    self.cards.unshift(angular.extend({}, newCard));
  };

 self.addCards = function() {
     $http.get('/auth/nearbyusers').then(function(users) {
       self.cardsLoaded = true;
       if(users.data.nearbyUsers === 'None') {
         $ionicPopup.alert({
          title: 'We Couldnt Find New Users in Your Area',
          template: 'Please Check Back Later',
          cssClass: 'matchPopup'
        });
       }
       else {
       angular.forEach(users.data, function(card) {
         if(card[0] === null) {
           return;
         } else {
         self.addCard(card[0].profile_pic, card[0].username, card[0].id, card[0].profile);
         console.log('THESE ARE CARDS', self.cards)
       }
       });
     }
     });
   };

  self.cardLike = function(card) {
    Finder.onRightSwipe(self.cards[0].id)
      $http.get('/auth/matchcheck/' + self.cards[0].id).then(function(response) {
        if(response.data.match === true) {
          $ionicPopup.alert({
            title: 'You\'ve Found a Match!',

            cssClass: 'matchPopup'
            //template: '<div class="popupImage"><img src="https://developer.apple.com/watch/human-interface-guidelines/icons-and-images/images/icon-and-image-large-icon-fitness.png"></div>'
     });
        } else {
          return;
        }
      });
  };

    self.cardDislike = function(card) {
      Finder.onLeftSwipe(self.cards[0].id);
    };

    self.removeCard = function($index) {
      self.cards.splice($index, 1);
    };
  self.find = Finder.getUsers();

}]);
