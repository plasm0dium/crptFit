angular.module('crptFit')
// Start of TASKS FACTORY =====================================================
//=============================================================================

.factory('Tasks', ['$http', function($http){

  var tasks = [];

  return {
    //Forces immediate update of task list
    getTaskHolder: function(val){
      tasks.push({description:val});
      return tasks;
    },
    finishTask : function(taskId, task){
      $http({
        method: 'POST',
        url: '/auth/task/complete/' + taskId,
      });
      tasks.splice(tasks.indexOf(task), 1);
    },
    // Fills task array with only not yet completed tasks
    getTasksList: function(){
      tasks = [];
      $http({
        method: 'GET',
        url: '/auth/tasks'
      }).then(function(response){
        response.data.forEach(function(x){
          if(!x.complete){
            tasks.push(x)
          }
        });
      });
      return tasks;
    },
    addTaskToClient : function(uId, val){
      $http({
        method: 'POST',
        url: '/auth/tasks/add'+uId,
        data : {
          taskname: val
        }
      });
    },
    addTaskToSelf: function(val){
      $http({
        method: 'POST',
        url: '/auth/tasks/'+val
      });
    }
  };
}])