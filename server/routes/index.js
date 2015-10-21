var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('./templates/login-tab'); // load login-tab.html file
});

module.exports = router;