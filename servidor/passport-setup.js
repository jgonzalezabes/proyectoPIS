const passport=require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(user, done) {
  //console.log(user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  //User.findById(id, function(err, user) {
    done(null, user);
  //});
});

passport.use(new GoogleStrategy({
    clientID:"571253589268-nn1s2cmb9e0cclp0v4r5pvtfllkvkgpc.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL:"http://localhost:3000/google/callback"
    //callbackURL:"https://proyecto22-3moug36toq-tl.a.run.app/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    //User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return done(null, profile);
    //});
  }
));
