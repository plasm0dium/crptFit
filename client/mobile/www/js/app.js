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

  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login-tab.html'
  })
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
          controller: 'ProgressCtrlStr'
        }
      }
    })
    .state('tab.weight', {
      url: '/weight',
      views: {
        'progress-tab':{
          templateUrl: 'templates/weight-tab.html',
          controller: 'ProgressCtrlWgt'
        }
      }
    })
    .state('tab.speed', {
      url: '/speed',
      views: {
        'progress-tab':{
          templateUrl: 'templates/speed-tab.html',
          controller: 'ProgressCtrlSpd'
        }
      }
    })
    .state('tab.tasks', {
      url: '/tasks',
      views: {
        'progress-tab':{
          templateUrl: 'templates/task-tab.html',
          controller: 'ProgressCtrlTask'
        }
      }
    })
    .state('tab.homepage', {
      url: '/homepage',
      views: {
        'homepage-tab': {
          templateUrl: 'templates/homepage-tab.html',
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
    .state('tab.social', {
      url: '/social',
      views: {
        'social-tab': {
          templateUrl: 'templates/social-tab.html',
        }
      }
    })
    .state('tab.userProfile', {
      url: '/viewuser',
      views: {
        'social-tab': {
          templateUrl: 'templates/profile-view.html',
          controller: 'SocialCtrl'
        }
      }
    })
  $urlRouterProvider.otherwise('/login');

})
