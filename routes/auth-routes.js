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
  const address     = req.body.mailingAddress;
  const city        = req.body.city;
  const state       = req.body.state;
  const zip         = req.body.zip;
  // const passwordConf =  req.body.passwordConf;
  // const credit = req.body.credit;


  if (name === "" || password === "" || email === "" || address === "" || city === "" || state === "" || zip === "") {
    res.status(400).json({ message: `Please indicate name, email a password and address details` });
    return;
  }

  User.findOne({ email }, "email", (err, user) => {
    if (user !== null) {
      res.status(400).json({ message: 'Oops, Looks like that email already has an account' });
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
        res.status(400).json({ message: 'Something went wrong' });
      } else {
        console.log("HEYYYYYY")

        req.login(newUser, (err) => {
          if (err) {
            res.status(500).json({ message: 'Something went wrong' });
            return;
          }
          console.log("LOGGED IN THROUGH SIGNUP")
          res.status(200).json(req.user);
        });
      }
    });
      
  });
});

//get login

authRoutes.get("/login", (req, res, next) => {
  res.redirect("/");
}); 
//end get login

//post login route
authRoutes.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, theUser, failureDetails) => {
    if (err) {
      res.status(500).json({ message: 'Something went wrong' });
      return;
    }

    if (!theUser) {
      res.status(401).json(failureDetails);
      return;
    }

    req.login(theUser, (err) => {
      if (err) {
        res.status(500).json({ message: 'Something went wrong' });
        return;
      }

      // We are now logged in (notice req.user)
      res.status(200).json(req.user);
    });
  })(req, res, next);
});



authRoutes.post("/logout", (req, res) => {
  req.logout();
  res.status(200).json({ message: 'Success' });
});
 
// authRoutes.get('/:id', (req, res, next) => {
//   console.log(req.params.id)
//   Product.findById(req.params.id)
//   .then((theProduct) => {
//     res.json(theProduct);
//   })
//   .catch((err)=>{
//     res.json(err)
//   })
// });


// end homepage get

//google login routes
authRoutes.get("/auth/google", passport.authenticate("google", {
  scope: ["https://www.googleapis.com/auth/plus.login",
          "https://www.googleapis.com/auth/plus.profile.emails.read"]
}));

authRoutes.get("/auth/google/callback", passport.authenticate("google", {
  failureRedirect: "/",
  successRedirect: "/"
}));


authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});


authRoutes.get('/loggedin', (req, res, next) => {
  console.log("user in backend: ", req.user)
  if (req.isAuthenticated()) {
    res.json(req.user);
    return;
  }

  res.json({ message: 'Unauthorized' });
});

authRoutes.post('/creditinfo', (req, res, next) => {
if(!req.user){
  res.status(401).json({message: 'You have to be logged in in order to add credit card!'})
}

    const theNewCard = new Credit({
      name: req.body.cardname,
      cardnumber: req.body.cardnumber,
      cardexp: req.body.cardexp,
      cvv: req.body.cvv,
      mailing_address: req.body.mailing_address,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip
    });

    theNewCard.save( err => {
      if(err){
        res.json(err);
        return;
      }
    console.log("user before save: ", req.user);

      req.user.creditCards.push(theNewCard._id);
      req.user.save( err => {
        console.log("user after save: ", req.user);

        if(err){
          res.json(err);
          return;
        }
        res.json(req.user);
      })
    })
}) 


authRoutes.get('/creditcards', (req, res, next) => {
  var cardsArray = [];
  User.findById(req.user._id)
  .then(foundUser => {
    foundUser.creditCards.forEach( oneCCNumber => {
      Credit.findById(oneCCNumber)
      .then(foundCard => {
        cardsArray.push(foundCard);
        console.log("cards array up: ", cardsArray)
      })
    })
    setTimeout(function(){
      res.json(cardsArray)
    }, 1000)
  })
} )


module.exports = authRoutes;