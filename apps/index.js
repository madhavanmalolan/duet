var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { user0: process.env.USER0, user1: process.env.USER1});
});

module.exports = router;
