const passport = require("passport");
// for passwords
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const User            = require('../models/user');
const GoogleStrategy  = require("passport-google-oauth").OAuth2Strategy;


//passport config area
passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

passport.use(new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true
}, (req, email, password, next) => {
  User.findOne({ email }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: "Incorrect email" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Incorrect password" });
    }

    return next(null, user);
  });
}));

//google login config
passport.use(new GoogleStrategy({
  clientID: "462796486579-56ufkfhv279bospu4ne2jr1dvt218as4.apps.googleusercontent.com",
  clientSecret: "_kpmbdhKU8TVB3RDPXtKObgy",
  callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
  User.findOne({ googleID: profile.id }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (user) {
      return done(null, user);
    }

    const newUser = new User({
      googleID: profile.id
    });

    newUser.save((err) => {
      if (err) {
        return done(err);
      }
      done(null, newUser);
    });
  });

}));
// end passport config area
