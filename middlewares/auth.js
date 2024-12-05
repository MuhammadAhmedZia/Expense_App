const JWT = require('jsonwebtoken');
// const JWT_Secret = 'your_jwt_secret_key';

const verifyToLogedInUser = async (req, res ,next) => {
    const token = req.cookies.token;
    if(!token){
        res.redirect('/login');
    }

    try {
        const decoded = JWT.verify(token,process.env.JWT_Secret);
        req.user = decoded;
        next();
    } catch (error) {
        console.log('Token varification failed',error);
        
        
    }
}

const restrictIfAuthenticateUser = async (req,res,next) => {
    const token = req.cookies.token;
    if(token){
        try {
            JWT.verify(token, process.env.JWT_Secret);
            return res.redirect('/');
        } catch (error) {
            console.log('invalid token',error);
            res.clearCookie('token');
        }
    }
    next();
}
module.exports = {
    verifyToLogedInUser,
    restrictIfAuthenticateUser,
}