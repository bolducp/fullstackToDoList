"use strict";

const PORT = 3000;

var http = require('http');
var fs  = require('fs');
var express = require('express');
var app = express();
var logger = require('morgan');
var bodyParser = require('body-parser');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get("/", function(req, res){
  var html = fs.readFileSync('./index.html').toString();
  res.send(html);
});

// middleware -->  next() just invokes the next piece of middleware;
app.get('/tasks', function(req, res){
  fs.readFile('./tasks.json', function(err, data){
    if (err) return res.status(400).send(err);
    var taskArr = JSON.parse(data)
    res.send(taskArr);
  });
});

app.post('/task/add', function(req, res){
    fs.readFile('./tasks.json', function(err, data){
      if (err) return res.status(400).send(err);

      var taskList = JSON.parse(data)
      var newTask = req.body;
      taskList.push(newTask);

      fs.writeFile('./tasks.json', JSON.stringify(taskList), function(err){
        if (err) return res.status(400).send(err);
        res.send("task added\n");
      });
    });
});

app.post('/task/delete', function(req, res){
    fs.readFile('./tasks.json', function(err, data){
      if (err) return res.status(400).send(err);

      var taskList = JSON.parse(data)
      var index = req.body;
      taskList.splice(index, 1);

      fs.writeFile('./tasks.json', JSON.stringify(taskList), function(err){
        if (err) throw err;
        res.send("task deleted\n");
      });
    });
});

app.post('/change/status', function(req, res){
    fs.readFile('./tasks.json', function(err, data){
      if (err) return res.status(400).send(err);
      var taskList = JSON.parse(data)
      var index = req.body.index;

      if (taskList[index].complete === "true") {
        taskList[index].complete = "false";
      } else {
        taskList[index].complete = "true";
      }
      fs.writeFile('./tasks.json', JSON.stringify(taskList), function(err){
        if (err) throw err;
        res.send("task status changed\n");
      });
    });
});




app.listen(PORT, function(){
  console.log("Express server listening on port", PORT)
});
