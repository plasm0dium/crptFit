angular.module('crptFit')
// Start of TASKS CTRL ========================================================
//=============================================================================

.controller('ProgressCtrlTask', ['Tasks', function(Tasks){

  var tasksProgress = this;

  tasksProgress.sendTo = {
    val : null
  };
  //Adds task to task array in services and to the user database
  tasksProgress.createTask = function(val){
    Tasks.addTaskToSelf(val);
    Tasks.getTaskHolder(val);
    tasksProgress.sendTo.val = null;
  };

  tasksProgress.startTasks = function(){
    tasksProgress.tasks = Tasks.getTasksList();
  };
  //Function for toggling task class for animations or styles
  tasksProgress.toggle = function(task){
    task.toggled = !task.toggled;
  };
  //Sets task to complete and removes from page
  tasksProgress.finishTask = function(taskId, task){
    self.finish = Tasks.finishTask(taskId, task);
  };
}])
