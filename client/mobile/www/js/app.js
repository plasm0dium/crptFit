angular.module('crptFit', ['ionic', 'highcharts-ng', 'ionic.contrib.ui.tinderCards'])

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
  .state('messages-send-tab', {
      url: '/message',
        views: {
        'app-nav': {
          templateUrl: 'templates/messages-send-tab.html',
          controller: 'MessagesCtrl as ctrl' 
        }
      }
  })
// Each tab has its own nav history stack:
  .state('dash', {
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
          controller: 'ProfileCtrl as ctrl'  
        }
      }
  })
  .state('progress', {
    url: '/progress',
      views: {
        'app-nav': {
          templateUrl: 'templates/progress-tab.html',
        }
      }
  })
  .state('strength', {
    url: '/strength',
      views: {
        'app-nav': {
          templateUrl: 'templates/strength-tab.html',
        }
      }  
  })
  .state('benchpress', {
    url: '/benchpress',
      views: {
        'app-nav': {
          templateUrl: 'templates/benchpress-tab.html',
          controller: 'ProgressCtrlBench as ctrl'  
        }
      }
  })
  .state('deadlift', {
    url: '/deadlift',
      views: {
      'app-nav': {
        templateUrl: 'templates/deadlift-tab.html',
        controller: 'ProgressCtrlDeadlift as ctrl'
        }
      }
  })
  .state('squats', {
    url: '/squats',
      views: {
        'app-nav': {
          templateUrl: 'templates/squats-tab.html',
          controller: 'ProgressCtrlSquats as ctrl'  
        }
      }
  })
  .state('weight', {
    url: '/weight',
      views: {
        'app-nav': {
          templateUrl: 'templates/weight-tab.html',
          controller: 'ProgressCtrlWgt as ctrl'  
        }
      }
  })
  .state('speed', {
    url: '/speed',
      views: {
        'app-nav': {
          templateUrl: 'templates/speed-tab.html',
          controller: 'ProgressCtrlSpd as ctrl'  
        }
      }
  })
  .state('tasks', {
    url: '/tasks',
      views: {
        'app-nav': {
          templateUrl: 'templates/task-tab.html',
          controller: 'ProgressCtrlTask as ctrl'  
        }
      }
  })
  .state('homepage', {
    url: '/homepage',
      views: {
        'app-nav': {
          templateUrl: 'templates/homepage-tab.html',
          controller: 'HomeCtrl as ctrl' 
        }
      }
  })
  .state('messages', {
    url: '/messages',
      views: {
        'app-nav': {
          templateUrl: 'templates/messages-tab.html',
          controller: 'MessagesCtrl as ctrl' 
        }
      }
  })
  .state('social', {
    url: '/social',
      views: {
        'app-nav': {
          templateUrl: 'templates/social-tab.html',
          controller: 'SocialCtrl as ctrl'  
        }
      }
  })
  .state('userProfile', {
    url: '/viewuser',
      views: {
        'app-nav': {
          templateUrl: 'templates/profile-view.html',
          controller: 'ProfileCtlr as ctrl'  
        }
      }
  })
  .state('tinderize', {
    url: '/tinderize',
      views: {
        'app-nav': {
          templateUrl: 'templates/tinder-tab.html',
          controller: 'CardsCtrl as ctrl'
        }
      }
  })
  .state('about', {
    url: '/about',
      views: {
        'app-nav' : {
          templateUrl: 'templates/about.html',
        }
      }
  })
  .state('how-to', {
    url: '/how-to',
      views: {
        'app-nav': {
          templateUrl: '/templates/how-to.html'
        }
      }
  })
  .state('profile-edit', {
    url: '/profile-edit',
      views: {
        'app-nav': {
          templateUrl: '/templates/profile-edit.html',
          controller: 'ProfileCtrl as ctrl'  
        }
      }
  })

  $urlRouterProvider.otherwise('/login');
});
