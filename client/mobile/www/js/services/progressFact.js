angular.module('crptFit')
// Start of PROGRESS FACTORY ====================================================
//=============================================================================

.factory('Progress', ['$http', function($http){
  var strength = [];
  var weight = [];
  var speed = [];
  var bench = [];
  var dead = [];
  var squatHold = [];
  //NOTE Commented out functions in this section are experimental weekly views and are not ready for deploy
  return {
    getStr : function(){
      return strength;
    },
    getBnch : function(){
      return bench;
    },
    getDed : function(){
      return dead;
    },
    getSqu : function(){
      return squatHold;
    },
    getSpd : function(){
      return speed;
    },
    getWgt : function(){
      return weight;
    },
    getSelf : function(){
      return selfUid;
    },
    pushBnch : function(val){
      // if(bench.length < 8){bench.push(val);}else{
      // bench.shift();
      bench.push(val);
      // }
    },
    pushDed : function(val){
      // if(dead.length < 8){dead.push(val);}else{
      // dead.shift();
      dead.push(val);
      // }
    },
    pushSqu : function(val){
      // if(squatHold.length < 8){squatHold.push(val);}else{
      // squatHold.shift();
      squatHold.push(val);
      // }
    },
    pushSpd : function(val){
      // if(speed.length < 8){speed.push(val);}else{
      // speed.shift();
      speed.push(val);
      // }
    },
    pushWgt : function(val){
      // if(weight.length < 8){weight.push(val);}else{
      // weight.shift();
      weight.push(val);
      // }
    },
    postBnch: function(stat){
      $http({
        method: 'POST',
        url: '/auth/bench/'+stat
      });
    },
    postDed: function(stat){
      $http({
        method: 'POST',
        url: '/auth/deadlift/'+stat,
      });
    },
    postSqu: function(stat){
      $http({
        method: 'POST',
        url: '/auth/squat/'+stat,
      });
    },
    postSpd : function(stat){
      $http({
        method: 'POST',
        url: '/auth/speed/'+stat,
      });
    },
    postWgt : function(stat){
      $http({
        method: 'POST',
        url: '/auth/weight/'+stat,
      });
    },
    queryBnch : function(val){
      $http({
        method: 'GET',
        url: '/auth/benchpress/'+val
      }).then(function(response){
        if(bench.length === 0){
          // if(response.data.length <= 8){
            for(var x = 0; x < response.data.length; x++){
              bench.push(response.data[x].benchpress);
            }
          // }else{
          //   bench.push(response.data[response.data.length-1].benchpress);
          // }
        }
      }, function(error){
        console.log('Something went wrong : ', error);
      });
    },
    queryDed : function(uId){
      $http({
        method: 'GET',
        url: '/auth/deadlift/'+uId
      }).then(function(response){
        if(dead.length === 0){
          // if(response.data.length <= 8){
            for(var x = 0; x < response.data.length; x++){
              dead.push(response.data[x].deadlift);
            }
          // }else{
          //   dead.push(response.data[response.data.length-1].deadlift);
          // }
        }
      }, function(error){
        console.log('Something went wrong : ', error);
      });
    },
    querySqu : function(uId){
      $http({
        method: 'GET',
        url: '/auth/squats/'+uId
      }).then(function(response){
        if(squatHold.length === 0){
          // if(response.data.length <= 8){
            for(var x = 0; x < response.data.length; x++){
              squatHold.push(response.data[x].squat);
            }
          // }else{
          //   squatHold.push(response.data[response.data.length-1].squat);
          // }
        }
      }, function(error){
        console.log('Something went wrong : ', error);
      });
    },
    querySpd : function(uId){
      $http({
        method: 'GET',
        url: '/auth/speeds/'+uId
      }).then(function(response){
        if(speed.length === 0){
          // if(response.data.length <= 8){
            for(var x = 0; x < response.data.length; x++){
              speed.push(response.data[x].speed);
            }
        // }else{
        //   for(var i = response.data.length-8; i < response.length; i++){
        //       speed.push(response.data[i].speed);
        //     }
          // }
        }
      }, function(error){
        console.log('Something went wrong : ', error);
      });
    },
    queryWgt : function(uId){
      $http({
        method: 'GET',
        url: '/auth/weight/'+uId
      }).then(function(response){
        if(weight.length === 0){
          // if(response.data.length <= 8){
            for(var x = 0; x < response.data.length; x++){
              weight.push(response.data[x].weight);
            }
        //   }else{
        //     weight.push(response.data[response.data.length-1].weight);
        //   }
        }
      }, function(error){
        console.log('Something went wrong : ', error);
      });
    }
  };
}])