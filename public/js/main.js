'use strict';

$(document).ready(init);

function init(){
  populateTasks();
  clickHandler();
}

function clickHandler(){
  $('#submit').click(addTaskToList);
  $('.glyphicon-trash').click(deleteTask);
  $('#removeCompleted').click(removeCompleted);
}

function populateTasks(){
  $.get('/tasks', function(data){
    var $tasks = createDomElements(data);
    $('#tasks').append($tasks);
  })
}

function createDomElements(data){
  return data.map(function(task){
    var $taskRow = $("#template").clone();
    $taskRow.removeAttr("id");
    $taskRow.children(".taskName").text(task.name);
    $taskRow.children(".dueDate").text(task.date);
    if (task.complete === true){
      $taskRow.children("#done").prop('checked', true);
    }
    return $taskRow;
  });
}



function addTaskToList(){
  var taskText = $('#task').val();
  var dueDate = moment($('#date').val()).format('MM-DD-YYYY');
  if (dueDate ==="Invalid date"){
    dueDate = " ";
  }
  var newTaskObj = {name: taskText, date: dueDate, complete: false};
  $.post('/task/add', newTaskObj)
    .success(function(data){
      var $newTask = createDomElements([newTaskObj]);
      $('#tasks').append($newTask);
    })
}


function deleteTask(){
  var $taskRow = ($(this).closest('.row'));
  $taskRow.addClass("animated fadeOutDown");
  setTimeout(function(){$taskRow.remove();}, 700);
}

function removeCompleted(){
  $("input:checked").parent().parent().remove();
}
