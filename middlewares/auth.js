const JWT = require('jsonwebtoken');


const verifyToLogedInUser = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/login');
    }

    try {
        JWT.verify(token, process.env.JWT_Secret, (err, decoded) => {
            if (err) {
                return res.redirect('/login');
            }

            req.user = decoded;
            next();
        });

    } catch (error) {
        console.log('Token varification failed', error);


    }
}

const restrictIfAuthenticateUser = async (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            JWT.verify(token, process.env.JWT_Secret);
            return res.redirect('/');
        } catch (error) {
            console.log('invalid token', error);
            res.clearCookie('token');
        }
    }
    next();
}
const refreshToken = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token){
            return res.redirect('/login');
        }
        const decoded =   JWT.verify(token, process.env.JWT_Secret)

        const isExpired = Date.now() >= decoded.exp * 1000;
        if(isExpired){
            return res.redirect('/login');
        }
        const newToken = JWT.sign({
            id: decoded.id,
            email: decoded.email 
            },process.env.JWT_Secret,
           { 
             expiresIn: '3m' 
           });

           res.cookie('jwt', newToken, {
            httpOnly: true,
            secure: true, // Set to true in production
            maxAge: 3600000, // 1 hour in milliseconds
            });   
            req.userId = decoded.id;
            next();
    } catch (error) {
        console.error('Error in refreshToken middleware:', err.message);
        return res.redirect('/login'); // Error? Redirect to login   
    }

    

    // JWT.verify(token, process.env.JWT_Secret, (err, decoded) => {
    //     if (!err) {
    //         const newToken = JWT.sign({
    //                userId: decoded._id,
    //                username: decoded.name 
    //                },process.env.JWT_Secret,
    //               { 
    //                 expiresIn: '3m' 
    //               });

    //         res.cookie('token', newToken, { httpOnly: true, secure: true });
    //     }
    //     next();
    // });

}
module.exports = {
    verifyToLogedInUser,
    restrictIfAuthenticateUser,
    refreshToken
}