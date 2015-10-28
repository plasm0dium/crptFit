var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('./templates/tabs');
});

module.exports = router;
