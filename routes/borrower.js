var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, function(req, res, next) {
  res.render('borrower/profile');
});

router.get('/new', isLoggedIn, function(req, res, next) {
  res.render('borrower/new');
});

router.post('/new', isLoggedIn, function(req, res, next) {
  res.render('borrower/n  ew');
});

router.get('/logout', isLoggedIn,function (req, res, next) {
  req.logout();
  res.redirect('/login');
});

router.use('/',notLoggedIn, function (req, res, next) {
  next();
});

router.get('/signup', function(req, res, next) {
  var messages = req.flash('error');
  res.render('borrower/signup', {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0
  });
});

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/borrower/profile',
  failureRedirect: '/borrower/signup',
  failureFlash: true
}));


router.get('/signin', function(req, res, next) {
  var messages = req.flash('error');
  res.render('borrower/signin', {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0
  });
});

router.post('/signin', passport.authenticate('local.signin', {
  successRedirect: '/borrower/profile',
  failureRedirect: '/borrower/signin',
  failureFlash: true
}));


module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}
