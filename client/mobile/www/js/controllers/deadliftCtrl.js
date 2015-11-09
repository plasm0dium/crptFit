angular.module('crptFit')
// Start of DEADLIFT PROGRESS CTRL ============================================
//=============================================================================

.controller('ProgressCtrlDeadlift', ['$scope','$http', 'Progress', function($scope, $http, Progress){

  var deadliftProgress = this;

  deadliftProgress.Dead = Progress.getDed();
  deadliftProgress.uId = null;
  deadliftProgress.deadData = {
       weight: null
    };
  //Adds data to database and to visual graph without re-rendering current data
  deadliftProgress.pushMe =  function(){
    Progress.pushDed(deadliftProgress.deadData.weight);
    Progress.postDed(deadliftProgress.deadData.weight);
    deadliftProgress.deadData.weight = null;
  };
  //Captures user id
  deadliftProgress.getUid = function(){
    $http({
      method: 'GET',
      url: '/auth/user'
    }).then(function(response){
      deadliftProgress.uId = response.data.id;
      deadliftProgress.checkMe(deadliftProgress.uId);
    });
  };
  //Uses captured uID to return the correct data table
  deadliftProgress.checkMe = function(val){
    deadliftProgress.deadData.weight = null;
    Progress.queryDed(val);
    deadliftProgress.Dead = Progress.getDed();
  };

  deadliftProgress.getUid();
  //Controls Highchart options
  $scope.chartConfig = {
    options: {
      chart: {
        backgroundColor: '#000',
        type: 'spline',
        style: {
          fontFamily: 'serif',
          backgroundColor: '#FFFEFF'
        }
      }
    },
    xAxis: {
      gridLineColor: '#FFFEFF',
      gridLineDashStyle: 'solid',
      labels: {
        style: {
          "color": "#FFFEFF"
        }
      },
      title: {
        style: {
          "color": "#FFFEFF"
        }
      }
    },
    yAxis: {
      gridLineColor: '#FFFEFF',
      gridLineDashStyle: 'solid',
      labels: {
        style: {
          "color": "#FFFEFF"
        }
      },
      title: {
        style: {
          "color": "#FFFEFF"
        }
      }
    },
    series: [{
      data: deadliftProgress.Dead
    }],
    title: {
      text: 'Deadlift',
      style: {
        "color": "#FFFEFF"
      }
    },
    loading: false
  };
}])
