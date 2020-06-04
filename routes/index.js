var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.get('/dashboard', function(req, res, next) {
  res.render('dashboard', { title: 'Express' });
});

router.get('/users', function(req, res, next) {
  res.render('users', { title: 'Express' });
});

router.get('/system', function(req, res, next) {
  res.render('system', { title: 'Express' });
});

module.exports = router;
