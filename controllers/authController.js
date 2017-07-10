const passport = require('passport');

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
}
