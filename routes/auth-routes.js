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
  const name        = req.body.name;
  const email       = req.body.email;
  const password    = req.body.password;
  const address     = req.body.address;
  const city        = req.body.city;
  const state       = req.body.state;
  const zip         = req.body.zip;
  const passwordConf =  req.body.passwordConf;
  // const credit = req.body.credit;


  if (name === "" || password === "" || email === "" || address === "" || city === "" || state === "" || zip === "") {
    res.render("signup", { message: `Please indicate name, email a password and credit/debit details` });
    return;
  }

  User.findOne({ email }, "email", (err, user) => {
    if (user !== null) {
      res.render("signup", { 
        message: "Oops, Looks like that email already has an account" 
      });
      return
    }
   
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      name,
      password: hashPass,
      email,
      address,
      city,
      state,
      zip
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
      
    // User.create({name:name, password:hashPass, email:email, address:address, city:city, state:state, zip:zip })
    // .then((theUser) => {
    //   res.redirect('/')
    // })
    // .catch((err)=>{
    //   console.log(err);
    // })
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
  successRedirect: "/",
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