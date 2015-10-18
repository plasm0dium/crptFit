var express = require('express');
var db = require('./mysql/config');
var app = require('./config/middleware.js');

var port = process.env.PORT || 8000;

app.listen(port, function(){
  console.log('listening on port...', port);
});