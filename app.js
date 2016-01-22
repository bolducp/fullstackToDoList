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
        res.send("name received\n");
      });
    });
});


app.post('/task/delete', function(req, res){
    fs.readFile('./names.txt', function(err, data){
      if (err) return res.status(400).send(err);

      var updatedText = JSON.parse(data)
      var name = req.body;
      updatedText.push(name);

      fs.writeFile('./names.txt', JSON.stringify(updatedText), function(err){
        if (err) throw err;
        res.send("name received\n");
      });
    });
});








app.listen(PORT, function(){
  console.log("Express server listening on port", PORT)
});
