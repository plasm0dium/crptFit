var express = require('express');
var User = express();
var db = require('../mysql/config');
require('../mysql/models/user');

// Grab the logged in user's user object
User.get('/user', function(req, res){
 db.model('User').fetchById({id: req.user.attributes.id})
 .then(function(user){
   res.json(user);
 });
});

module.exports = User;
