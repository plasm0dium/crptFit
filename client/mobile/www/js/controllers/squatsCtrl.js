angular.module('crptFit')
// Start of SQUAT PROGRESS CTRL ===============================================
//=============================================================================

.controller('ProgressCtrlSquats', ['$scope', '$http', 'Progress', function($scope, $http, Progress){

  var squatProgress = this;

  squatProgress.Squat = Progress.getSqu();
  squatProgress.uId = null;
  squatProgress.squatData = {
    weight: null
  };
  //Adds data to database and visual graph without re-rendering current data
  squatProgress.pushMe = function(){
    Progress.pushSqu(squatProgress.squatData.weight);
    Progress.postSqu(squatProgress.squatData.weight);
    squatProgress.squatData.weight = null;
  };
  //Capture user id
  squatProgress.getUid = function(){
    $http({
      method: 'GET',
      url: '/auth/user'
    }).then(function(response){
      squatProgress.uId = response.data.id;
      squatProgress.checkMe(squatProgress.uId);
    });
  };
  //Uses captured uID to return the correct data table
  squatProgress.checkMe = function(val){
    squatProgress.squatData.weight = null;
    Progress.querySqu(val);
    squatProgress.Squat = Progress.getSqu();
  };

  squatProgress.getUid();
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
      data: squatProgress.Squat
    }],
    title: {
      text: 'Squats',
      style: {
        "color": "#FFFEFF"
      }
    },
    loading: false
  };
}])