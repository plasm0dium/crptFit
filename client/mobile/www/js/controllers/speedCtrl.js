angular.module('crptFit')
// Start of SPEED PROGRESS CTRL ===============================================
//=============================================================================

.controller('ProgressCtrlSpd', ['$scope', '$http', 'Progress', function($scope, $http, Progress){

  var speedProgress = this;

  speedProgress.Speed = Progress.getSpd();
  speedProgress.timeSpd = {
    val: null
  };
  speedProgress.distance={
    val: null
  };
  speedProgress.uId = null;
  //Adds data to database and visual graph without re-rendering current data
  speedProgress.pushMe = function(){
    Progress.pushSpd((speedProgress.distance.val/speedProgress.timeSpd.val)*60);
    Progress.postSpd((speedProgress.distance.val/speedProgress.timeSpd.val)*60);
    speedProgress.distance.val = null;
    speedProgress.timeSpd.val = null;
    Progress.getSpd();
  };
  //Captures user id
  speedProgress.getUid = function(){
    $http({
      method: 'GET',
      url: '/auth/user'
    }).then(function(response){
      speedProgress.uId = response.data.id;
      speedProgress.checkMe(speedProgress.uId);
    });
  };
  //Uses captured uID to return the correct data table
  speedProgress.checkMe = function(val){
    speedProgress.timeSpd.val = null;
    speedProgress.distance.val = null;
    Progress.querySpd(val);
    speedProgress.Speed = Progress.getSpd();
  };

  speedProgress.getUid();
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
      data: speedProgress.Speed
    }],
    title: {
      text: 'Speed',
      style: {
        "color": "#FFFEFF"
      }
    },
    loading: false
  };
}])