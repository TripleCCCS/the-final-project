const express = require('express');
const router  = express.Router();
const Cart    = require('../models/cart')
const User    = require('../models/user')
const Product = require("../models/product");


router.post('/cart', (req, res, next) => {
  var prodId = req.body.prodId;
  User.findById(req.user._id)
  .then( foundUser => {
    Product.findById(prodId)
    .then( foundProduct => {
      foundUser.cart_id.push(foundProduct._id);
      foundUser.save( err => {
        if(err){
          res.json(err);
          return;
        }
        res.status(200).json(foundUser)
      } )
      // console.log("whattt: ", foundProduct)
    } )
    // console.log("whos user: ", foundUser)
  } )
})




router.get('/user/:id/cart', (req, res, next) => {
  // var userId = req.params.id;
  var myCart = [];
  User.findById(req.user._id)
  .then( foundUser => {
    var arrayOfProductIds = foundUser.cart_id;
    // console.log("array is: ", arrayOfProductIds)
    arrayOfProductIds.forEach(oneId => {
      Product.findById(oneId)
      .then( foundProduct => {
        myCart.push(foundProduct);
      } )
    })
    setTimeout(function(){
      // console.log("1 is: ", arrayOfProductIds.length )
      // console.log("2 is: ", myCart.length)
      if(arrayOfProductIds.length === myCart.length){
        res.json(myCart)
      }
    },3000)
  } )
});



module.exports = router