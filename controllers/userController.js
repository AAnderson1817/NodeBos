const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.loginForm = (req,res) => {
  res.render('login', {title: 'Login' });
}

exports.registerForm = (req,res) => {
  res.render('register', {title: "Register"});
}

exports.validateRegister = (req,res,next) => {
  req.sanitizeBody('name');
  req.checkBody('name', "You must supply a name!").notEmpty();
  req.checkBody('email', "That email is not valid.").isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', "Password cannot be blank.").notEmpty();
  req.checkBody('password-confirm', "Please confirm email.").notEmpty();
  req.checkBody('password-confirm', "Toasty! Passwords don't match!").equals(req.body.password);

  const errors = req.validationErrors();
  if(errors){
    req.flash('error', errors.map(err => err.msg));
    //Ensure if there's an error, it doesn't clear all of the user's other input fields, which is incredibly frustrating.
    res.render('register', {title: "Register", body: req.body, flashes: req.flash() });
    return; //Stop function if there are errors
  }
  next(); //There are no errors, proceed!
};

exports.register = async(req,res,next) => {
  const user = new User({ email: req.body.email, name: req.body.name });
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  next(); //Pass to authController.login

};

exports.account = (req,res) =>{
  res.render('account', {title: 'Edit Your Account'});
};

exports.updateAccount = async(req,res) =>{
  const updates = {
    name: req.body.name,
    email: req.body.email
  };

  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: updates },
    { new: true, runValidators: true, context: 'query' }
  );
  req.flash('success', 'Update Success')
  res.redirect('back');
}
