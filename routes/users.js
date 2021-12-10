const express = require("express");
const router = express.Router({mergeParams: true});
const catchAsync = require("../utils/catchAsync");
const expressError = require("../utils/expressErrors");
const User = require("../models/user");
const passport = require('passport');
const isLoggedIn = require('../middleware');

const {newUserForm, newUser, loginForm, loginPost, logoutMethod} = require('../controllers/users')

router.route('/register')
  .get(newUserForm)
  .post(catchAsync(newUser));

router.route('/login')
  .get(loginForm)
  .post(
    passport.authenticate('local', {
        failureFlash: true, failureRedirect: '/login'
      }),
    loginPost
  );

router.get('/logout', logoutMethod);

module.exports = router;