const User = require("../models/user");

const newUserForm = (req, res) => {
  res.render("./Users/register");
};

const newUser = async (req, res, next) => {
  try {
    const {username, email, password} = req.body;
    const newUser = new User({username, email});
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err)
        return next(err);
    })
    req.flash('success', 'Successfully Registered');
    return res.redirect('/courses');
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('/register');
  }
};

const loginForm = (req, res) => {
  res.render('./Users/login');
};

const loginPost = (req, res) => {
  req.flash('success', 'Welcome Back!')
  const redirectUrl = req.session.returnTo || '/courses';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

const logoutMethod = (req, res) => {
  req.logout();
  req.flash('success', 'Tata!')
  res.redirect('/courses');
};

module.exports = {newUserForm, newUser, loginForm, loginPost, logoutMethod};