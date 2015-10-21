angular.module('crptFit', ['ionic', 'crptFit.controllers', 'crptFit.services', 'highcharts-ng'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login-tab.html',
    controller: "LoginCtrl"

  })
  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
  // Each tab has its own nav history stack:
    .state('tab.profile', {
      url: '/profile',
      views: {
        'profile-tab': {
          templateUrl: 'templates/profile-tab.html',
          controller: 'ProfileCtrl'
        }
      }
    })
    .state('tab.progress', {
      url: '/progress',
      views: {
        'progress-tab':{
          templateUrl: 'templates/progress-tab.html',
          controller: 'ProgressCtrl'
        }
      }
    })
    .state('tab.strength', {
      url: '/strength',
      views: {
        'progress-tab':{
          templateUrl: 'templates/strength-tab.html',
          controller: 'ProgressCtrl'
        }
      }
    })
    .state('tab.weight', {
      url: '/weight',
      views: {
        'progress-tab':{
          templateUrl: 'templates/weight-tab.html',
          controller: 'ProgressCtrl'
        }
      }
    })
    .state('tab.speed', {
      url: '/speed',
      views: {
        'progress-tab':{
          templateUrl: 'templates/speed-tab.html',
          controller: 'ProgressCtrl'
        }
      }
    })
    .state('tab.homepage', {
      url: '/homepage',
      views: {
        'homepage-tab': {
          templateUrl: 'templates/homepage-tab.html',
          controller: 'HomeCtrl'
        }
      }
    })
    .state('tab.messages', {
      url: '/messages',
      views: {
        'messages-tab': {
          templateUrl: 'templates/messages-tab.html',
          controller: 'MessagesCtrl'
        }
      }
    })
    .state('tab.messages-send-tab', {
      url: '/message',
      views: {
        'messages-tab': {
          templateUrl: 'templates/messages-send-tab.html',
          controller: 'MessagesCtrl'
        }
      }
    })
    .state('tab.group', {
      url: '/social',
      views: {
        'group-tab': {
          templateUrl: 'templates/social-tab.html',
          controller: 'SocialCtrl'
        }
      }
    })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
