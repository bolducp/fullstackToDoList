'use strict';

$(document).ready(init);

function init(){
  var currentDate = moment().format('YYYY-MM-DD');
  $('#date').attr("min", currentDate);
  populateTasks();
  clickHandler();
}

function clickHandler(){
  $("form").submit(addTaskToList);
  $("tbody").on("click", ".trashButton", deleteTask);
  $("tbody").on("click", ".done", changeCompletionStatus);
}

function populateTasks(){
  $.get('./tasks', function(data){
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
    if (task.complete === "true"){
      $taskRow.find(".done").prop('checked', true);
    }
    return $taskRow;
  });
}

function addTaskToList(e){
  e.preventDefault();
  var taskText = $('#task').val();
  var dueDate = moment($('#date').val()).format('MM-DD-YYYY');
  if (dueDate ==="Invalid date"){
    dueDate = " ";
  }
  var newTaskObj = {name: taskText, date: dueDate, complete: "false"};
  $.post('./task/add', newTaskObj)
    .success(function(data){
      var $newTask = createDomElements([newTaskObj]);
      $('#tasks').append($newTask);
  })
}

function deleteTask(){
  var $taskRow = $(this).closest('tr');
  var indexToRemove = $taskRow.index() - 1;
  $.post('./task/delete', indexToRemove)
    .success(function(data){
    $taskRow.addClass("animated fadeOutDown");
    setTimeout(function(){
      $taskRow.remove();
    }, 700);
  })
}

function changeCompletionStatus(){
  var $taskRow = $(this).closest('tr');
  var indexToChange = $taskRow.index() - 1;
  $.post('./change/status', { "index": indexToChange})
    .success(function(data){
    $taskRow.addClass("animated flash");
  })
}

function removeCompleted(){
  $("input:checked").parent().parent().remove();
}
