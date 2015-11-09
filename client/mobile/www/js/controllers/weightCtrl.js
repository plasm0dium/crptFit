angular.module('crptFit')
// Start of WEIGHT PROGRESS CTRL ==============================================
//=============================================================================

.controller('ProgressCtrlWgt', ['$scope', '$http', 'Progress', function($scope, $http, Progress) {

  var weightProgress = this;

  weightProgress.uId = null;
  weightProgress.weight = {
    weight: null,
  };
  weightProgress.Weight = Progress.getWgt();
  //Adds data to database and visual graph without re-rendering current data
  weightProgress.pushMe = function(){
    Progress.pushWgt(weightProgress.weight.weight);
    Progress.postWgt(weightProgress.weight.weight);
    weightProgress.weight.weight = null;
  };
  //Captures user id
  weightProgress.getUid = function(){
    $http({
      method: 'GET',
      url: '/auth/user'
    }).then(function(response){
      weightProgress.uId = response.data.id;
      weightProgress.checkMe(weightProgress.uId);
    });
  };
  //Uses captured uID to return the correct data table
  weightProgress.checkMe = function(val){
    weightProgress.weight.weight = null;
    Progress.queryWgt(val);
    weightProgress.Weight = Progress.getWgt();
  };

  weightProgress.getUid();
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
      data:  weightProgress.Weight
    }],
    title: {
      text: 'Weight',
        style: {
          "color": "#FFFEFF"
        }
    },
    loading: false
  };
}])