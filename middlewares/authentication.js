require('dotenv').config();
const {validateToken,createTokenForUser}=require("../services/authentication");
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const User=require("../models/user");
const passport=require("passport");




function checkTokenForUser(req, res, next) {
  const token = req.cookies.token;
  if (token) {
    try {
      res.user = validateToken(token);
    } catch (e) {
      res.clearCookie('token');
      res.user = null;
    }
  } else {
    res.user = null;
  }
  next();
}


function requireLogin(req, res, next) {
  if (!res.user) {
    return res.redirect('/user/login');
  }
  next();
}


 

passport.use(new GoogleStrategy({
    clientID:    process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  'http://localhost:9000/auth/google/callback',
    passReqToCallback: true
  },
  async (request, accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0].value;
      if (!email) {
        return done(new Error('No email found in Google profile'), null);
      }

      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          email,
          fullname: profile.displayName,
          password: Math.random().toString(36).slice(-8),
        });
      }

      const token = createTokenForUser(user);
      return done(null, {
        id:       user._id,
        email:    user.email,
        fullname: user.fullname,
        token
      });
    } catch (err) {
      return done(err, null);
    }
  }
));

module.exports =  { checkTokenForUser,requireLogin} ;