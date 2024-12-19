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
    const token = req.cookies.token;
    JWT.verify(token, process.env.JWT_Secret, (err, decoded) => {
        if (!err) {
            const newToken = JWT.sign({
                   userId: user._id,
                   username: user.name 
                   },process.env.JWT_Secret,
                  { 
                    expiresIn: '1h' 
                  });

            res.cookie('token', newToken, { httpOnly: true, secure: true });
        }
        next();
    });

}
module.exports = {
    verifyToLogedInUser,
    restrictIfAuthenticateUser,
    refreshToken
}