const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  successRedirect: '/',
  successFlash: 'Log-win!'
})

exports.logout = (req,res) => {
  req.logout();
  req.flash('success', 'Logged Out');
  res.redirect('/');
}

exports.isLoggedIn = (req,res,next) =>{
  //First, check if user is authenticated
  if(req.isAuthenticated()){
    next(); //They are logged in. Proceed.
    return;
  }
  req.flash('error', "You need to log in first.")
  res.redirect('/login');
};

exports.forgot = async (req,res) =>{
  //First, see if the user exists.
  const user = await User.findOne( {email: req.body.email });
  if(!user){
    req.flash('error', "No such account/email pair exists.");
    return res.redirect('/login');
  }
  //Then, attach a reset token with expiration date.
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000; //One hour from now.
  await user.save();
  //Next, send them a e-mail with the token.
  const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
  req.flash('success', `Password reset sent. ${resetURL}`);
  //Finally, redirect them to the login page.
  res.redirect('/login');
}

exports.reset = async(req,res) =>{
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user){
    req.flash('error', 'Password reset is invalid or has expired');
    return res.redirect('/login');
  }
  //If there is a user, show the reset password form.
  res.render('reset', {title: "Reset Your Password"});
}
