angular.module('crptFit', ['ionic', 'crptFit.controllers', 'crptFit.services', 'highcharts-ng', 'ionic.contrib.ui.tinderCards'])

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
  //   .state('tab', {
  //   url: '/tab',
  //   abstract: true,
  //   templateUrl: 'templates/tabs.html'
  // })
// Each tab has its own nav history stack:
.state('dash',{
  url:'/dash',
  views: {
    'app-nav': {
      templateUrl: 'templates/dashboard.html'
    }
  }
})
    .state('profile', {
      url: '/profile',
      views: {
        'app-nav': {
          templateUrl: 'templates/profile-tab.html',
          controller: 'ProfileCtrl'
        }
      }
    })
    .state('progress', {
      url: '/progress',
    views: {
        'app-nav': {
          templateUrl: 'templates/progress-tab.html',
          controller: 'ProgressCtrl'
        }
      }
    })
    .state('strength', {
      url: '/strength',
        views: {
          'app-nav': {
            templateUrl: 'templates/strength-tab.html',
            controller: 'ProgressCtrlStr'
        }
      }
    })
    .state('benchpress', {
      url: '/benchpress',
       views: {
        'app-nav': {
          templateUrl: 'templates/benchpress-tab.html',
          controller: 'ProgressCtrlBench'
        }
      }
    })
    .state('deadlift', {
      url: '/deadlift',
       views: {
        'app-nav': {
          templateUrl: 'templates/deadlift-tab.html',
          controller: 'ProgressCtrlDead'
        }
      }
    })
    .state('squats', {
      url: '/squats',
       views: {
        'app-nav': {
          templateUrl: 'templates/squats-tab.html',
          controller: 'ProgressCtrlSquats'
        }
      }
    })
    .state('weight', {
      url: '/weight',
        views: {
        'app-nav': {
          templateUrl: 'templates/weight-tab.html',
          controller: 'ProgressCtrlWgt'
        }
      }
    })
    .state('speed', {
      url: '/speed',
        views: {
        'app-nav': {
          templateUrl: 'templates/speed-tab.html',
          controller: 'ProgressCtrlSpd'
        }
      }
    })
    .state('tasks', {
      url: '/tasks',
        views: {
        'app-nav': {
          templateUrl: 'templates/task-tab.html',
          controller: 'ProgressCtrlTask'
        }
      }
    })
    .state('homepage', {
      url: '/homepage',
        views: {
        'app-nav': {
          templateUrl: 'templates/homepage-tab.html',
        }
      }
    })
    .state('messages', {
      url: '/messages',
      views: {
        'app-nav': {
          templateUrl: 'templates/messages-tab.html',
        }
      }
    })
    .state('messages-send-tab', {
      url: '/message',
        // views: {
        // 'app-nav': {
          templateUrl: 'templates/messages-send-tab.html',
      //   }
      // }
    })
    .state('social', {
      url: '/social',
        views: {
        'app-nav': {
          templateUrl: 'templates/social-tab.html',
        }
      }
    })
    .state('userProfile', {
      url: '/viewuser',
        views: {
        'app-nav': {
          templateUrl: 'templates/profile-view.html',
        }
      }
    })
    .state('tinderize', {
      url: '/tinderize',
        views: {
        'app-nav': {
          templateUrl: 'templates/tinder-tab.html',
          controller: 'CardsCtrl'
        }
      }
    })
  $urlRouterProvider.otherwise('/login');

})
