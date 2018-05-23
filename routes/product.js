const express = require('express');
const router  = express.Router();


/* get the list of all the products */
router.get('/products', (req, res, next) => {
  Product.find()
  .then((list)=>{
    console.log("products in the backend: ", list)
    res.json(list);
  })
  .catch((err)=>{
    res.json(err)
  })
});


//get details about a sepcific product
router.get('/products/:productID', (req, res, next) => {
  Product.findById(req.params.productID)
  .then((theProduct)=>{
    res.json(theProduct);
  })
  .catch((err)=>{
    res.json(err)
  })
});

//add a NEW product
router.post('/product', (req, res, next)=>{
  console.log(req.body);
    const newProduct = {
      quantity: req.body.quantity,
      size: req.body.size,
      description: req.body.description,
      category: req.body.category,
      color: req.body.color,
      material: req.body.material,
      name: req.body.name,
      price: req.body.price

    }

  // Task.create(req.body) would work too
    Product.create(newProduct)
    .then((productJustCreated)=>{
      res.json(productJustCreated)
    })
    .catch((err)=>{
      res.json(err)
    })

  });


    router.post('/products/delete/:id', (req, res, next)=>{
      Product.findByIdAndRemove(req.params.id)
      .then((productJustDeleted)=>{
        res.json(productJustDeleted)
      })
      .catch((err)=>{
        res.json(err)
      })

    })

    router.post('/products/update/:id', (req, res, next)=>{
      console.log(req.body)
      Product.findByIdAndUpdate(req.params.id, req.body)
      .then(updatedProduct=>{
        console.log("updatedProduct: ", updatedProduct)
        res.json(updatedProduct);
      })
      .catch((err)=>{
        console.log("err: ", err)
        res.json(err)
      })

    });


















module.exports = router;