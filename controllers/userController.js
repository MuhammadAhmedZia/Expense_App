const User = require('../models/user');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

const { signupSchema, loginSchema } = require('../middlewares/userValidations');
// const JWT_Secret = 'your_jwt_secret_key';




const HandleToSignupUser = async (req, res) => {
  const {name,email,password}    = req.body;
  const { error } = signupSchema.validate({name, email, password}, { abortEarly: false });
  if(error){
    const errors = error.details.reduce((acc, curr) => {
      acc[curr.context.key] = curr.message;
      return acc;
  }, {});
  // return res.render('signup', { errors,data:req.body });
  return res.render('signup', {
    nameError: errors.name || null,
    emailError: errors.email || null,
    passwordError: errors.password || null,
    nameValue: name,
    emailValue: email,
  });
  }
  
  
  
  try {
    const user = await User.findOne({email});
    if(user){
      return res.render('signup', {
        nameError: null,
        emailError: 'Email is already registered.',
        passwordError: null,
        nameValue: name,
        emailValue: email,
      });
      // return res.render('signup',{
      //     error:'This User already exist!'
      // })
    }
  
    const newUser = new User({name,email,password,});
    newUser.password = await bcrypt.hash(password,10);
    await newUser.save();
    res.redirect('/login');  
  } catch (error) {
    console.error('Signup Error:', error);
    return res.render('signup', {
      nameError: null,
      emailError: 'An error occurred. Please try again later.',
      passwordError: null,
      nameValue: name,
      emailValue: email,
    })
  }
  

}

const HandleToLoginUser = async (req, res) => {
  const {email, password} = req.body;

  const { error } = loginSchema.validate({email, password}, { abortEarly: false });
  
  if (error) {
      const errors = error.details.reduce((acc, curr) => {
          acc[curr.context.key] = curr.message;
          return acc;
      }, {});
      // return res.render('login', {errors, email: req.body.email });
      return res.render('login', {
        emailError: errors.email || null,
        passwordError: errors.password || null,
        emailValue: email, // Keep the email input value
      })
  }
 
  
  try {
  
  const user = await User.findOne({email});

  if(!user){
    // return res.redirect('/login ? error=Email not found. Please try again.');
    return res.render('login', {
      emailError: 'Email not found. Please try again.',
      passwordError: null,
      emailValue: email, // Keep the email field value
    });
    
  }

  const userPassword = await bcrypt.compare(password ,user.password);
  
  if(!userPassword){
    // return res.redirect('/login?error=Incorrect password. Please try again.');
    return res.render('login', {
      emailError: null,
      passwordError: 'Incorrect password. Please try again.',
      emailValue: email, // Keep the email field value
    })
  }
  if(user && userPassword){
    const token = JWT.sign({
       userId: user._id,
       username: user.name 
       },process.env.JWT_Secret,
      { 
        expiresIn: '1h' 
      });

    res.cookie('token',token);
    return res.redirect('/'); 
  }else{
    return res.redirect('/login')
  }
 } catch (err) {
  console.log('login failed',err);
  // res.redirect('/login?error=An error occurred. Please try again later.');
  return res.render('login', {
    emailError: null,
    passwordError: 'An error occurred. Please try again later.',
    emailValue: email, // Keep the email field value
  });
 }

}

const HandleToLogoutUser = async (req,res) => {
  res.clearCookie('token');
  res.redirect('/login');
}
module.exports = {
    HandleToLoginUser,
    HandleToSignupUser,
    HandleToLogoutUser,
}