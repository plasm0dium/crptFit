angular.module('crptFit')
// Start of BENCHPRESS PROGRESS CTRL ==========================================
//=============================================================================

.controller('ProgressCtrlBench', ['$scope', '$http', 'Progress', 'Social', function($scope, $http, Progress, Social){

  var benchProgress = this;
  console.log('i am a controller!')
  benchProgress.Bench = Progress.getBnch();
  benchProgress.benchData = {
    weight: null
  };
  //Adds data to database and to visual graph without re-rendering current data
  benchProgress.pushMe = function(){
    Progress.pushBnch(benchProgress.benchData.weight);
    Progress.postBnch(benchProgress.benchData.weight);
    benchProgress.benchData.weight = null;
  };
  //captures user id
  benchProgress.getUid = function(){
    $http({
      method: 'GET',
      url: '/auth/user'
    }).then(function(response){
      benchProgress.uId = response.data.id;
      benchProgress.checkMe(benchProgress.uId);
    });
  };
  //uses captured uID to return the correct data table
  benchProgress.checkMe = function(val){
    Progress.queryBnch(val);
    benchProgress.Bench = Progress.getBnch();
    benchProgress.benchData.weight = null;
  };

  benchProgress.uId = null;
  benchProgress.getUid();
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
      data: benchProgress.Bench
    }],
    title: {
      text: 'Benchpress',
      style: {
        "color": "#FFFEFF"
      }
    },
    loading: false
  };
}])