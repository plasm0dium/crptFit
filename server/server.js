var express = require('express');
var db = require('./mysql/config');
var http = require('http');
var bodyParser = require('body-parser')
var passport = require('passport');

var morgan = require('morgan')
var app = express();
var port = process.env.PORT || 8000;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.listen(port, function(){
  console.log('listening on port...', port);
});
