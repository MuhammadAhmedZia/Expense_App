const { HandleToLoginUser, HandleToSignupUser,HandleToLogoutUser } = require('../controllers/userController');
const { restrictIfAuthenticateUser } = require('../middlewares/auth');
const {loginValidation,signupValidation} = require('../middlewares/userValidations');


const router = require('express').Router();


router.get('/signup',restrictIfAuthenticateUser,(req,res)=>{
    
    res.render('signup', { errors: {}, data: req.body  , nameError: null, emailError: null, passwordError: null, nameValue: '', emailValue: ''  });
    // res.render('signup');
});

router.get('/login',restrictIfAuthenticateUser,(req,res)=>{
    const error = req.query.error || null; // Get error from query parameters
    res.render('login', { errors: {}, data: {} ,emailError: null, passwordError: null, emailValue: ''  });
});

router.get('/home',(req, res) => res.render('home'));

router.post('/signup',HandleToSignupUser);
router.post('/login',HandleToLoginUser);
router.get('/logout',HandleToLogoutUser);


module.exports = router;