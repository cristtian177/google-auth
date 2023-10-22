const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
require("dotenv").config();

const redis = require("redis");
const client = redis.createClient({
  url: "redis://localhost:6379",
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
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

      // almacena en redis
      const userSessionKey = `user:${profile}`;
      const expirationTime = 3600000; //ms
      client.setEx(
        userSessionKey,
        JSON.stringify(profile),
        "PX",
        expirationTime
      );

      done(null, profile);
    }
  )
);

client.on("error", function (err) {
  console.error("Error de Redis: " + err);
});

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
