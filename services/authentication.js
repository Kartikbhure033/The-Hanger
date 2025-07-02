require('dotenv').config();
var jwt = require('jsonwebtoken');

const secret=process.env.JWT_SECRET;

function createTokenForUser(user){
    const payload={
        _id:user._id,
        email:user.email,
        fullname:user.fullname,
    }
    const token=jwt.sign(payload,secret,{ expiresIn: '7d' });
    return token;
}

function validateToken(token){
    const payload=jwt.verify(token,secret);
    return payload;
}

module.exports={
    createTokenForUser,validateToken
}