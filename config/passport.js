var passport = require('passport');
var Borrower = require('../models/borrower');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(borrower, done) {
  done(null, borrower.id);
});

passport.deserializeUser(function(id, done) {
  Borrower.findById(id, function(err, borrower) {
    done(err, borrower);
  });
});

passport.use('local.signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done) {
  req.checkBody('name','Empty Name').notEmpty();
  req.checkBody('email','Invalid Email').notEmpty().isEmail();
  req.checkBody('password','Invalid Password').notEmpty().isLength({min:4});
  var name=req.body.name;
  var errors = req.validationErrors();
  if(errors){
    var messages =[];
    errors.forEach(function (error) {
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages));
  }
  Borrower.findOne({
      'email': email
    },

    function(err, borrower) {
      if (err) {
        return done(err);
      }
      if (borrower) {
        return done(null, false, {
          message: 'Email is already in use.'
        });
      }
      var newBorrower = new Borrower();
      newBorrower.name= name;
      newBorrower.email = email;
      newBorrower.password = newBorrower.encryptPassword(password);
      newBorrower.save(function(err, result) {
        if (err) {
          return done(err);
        }
        return done(null, newBorrower);
      });
    });
  }));

passport.use('local.signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
},
function (req, email, password, done) {
  req.checkBody('email','Invalid Email').notEmpty();
  req.checkBody('password','Invalid Password').notEmpty();
  var errors = req.validationErrors();
  if(errors){
    var messages =[];
    errors.forEach(function (error) {
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages));
  }
  Borrower.findOne({
      'email': email
    },

    function(err, borrower) {
      if (err) {
        return done(err);
      }
      if (!borrower) {
        return done(null, false, {
          message: 'No Borrower Found.'
        });
      }
      if(!borrower.validPassword(password))
      {
        return done(null, false, {
          message: 'Wrong Password.'
        });
      }
      return done(null, borrower);
    });
}));
