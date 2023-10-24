const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    
    async function (request, accessToken, refreshToken, profile, done) {
      profile = profile._json;
      //console.log(profile);

      profile = [
        {
          id_user: profile.sub,
          name: profile.name,
          picture: profile.picture,
          email: profile.email,
          isAdmin: null,
        },
      ];
      //console.log(profile);

      done(null, profile);  
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
