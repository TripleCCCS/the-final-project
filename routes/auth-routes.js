const express             = require("express");
const authRoutes          = express.Router();
const passport            = require("passport");
const flash               = require("connect-flash");
const ensureLogin         = require("connect-ensure-login");
const bcrypt              = require("bcrypt");
const bcryptSalt          = 10;
const User                = require("../models/user");
const Product             = require("../models/product");
const Credit              = require("../models/credit");




authRoutes.get("/signup", (req, res, next) => {
  res.render("signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("signup", { message: `Please indicate username and password` });
    return;
  }

  User.findOne({ username:username }, "username", (err, user) => {
    if (user !== null) {
      res.render("signup", { 
        message: "Oops, Looks like that username already exists" 
      });
      return
    }
   
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
      
    User.create({username:username, password:hashPass})
    .then((theUser) => {
      res.redirect('/')
    })
    .catch((err)=>{
      console.log(err);
    })
  });
});

//get login

authRoutes.get("/login", (req, res, next) => {
  res.redirect("/");
}); 
//end get login

//post login route
authRoutes.post("/user-login", passport.authenticate("local",
{
  successRedirect: "/recipes",
  failureRedirect: "/",
  failureFlash: false,
  passReqToCallback: true
}
));
// end post /login




// end homepage get

//google login routes
authRoutes.get("/auth/google", passport.authenticate("google", {
  scope: ["https://www.googleapis.com/auth/plus.login",
          "https://www.googleapis.com/auth/plus.profile.emails.read"]
}));

authRoutes.get("/auth/google/callback", passport.authenticate("google", {
  failureRedirect: "/",
  successRedirect: "/user-profile"
}));


authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;