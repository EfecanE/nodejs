const Cart = require("../models/cart");
const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findByPk(productId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.getProductById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect("/cart");
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      cart
        .getProducts()
        .then((products) => {
          res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            products: products,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));

  // Cart.getCart((cartDetails) => {
  //   Product.fetchAll((products) => {
  //     let cartProducts = [];
  //     let cartTotalPrice = 0;

  //     if (cartDetails.products.length > 0) {
  //       cartTotalPrice = cartDetails.totalPrice;
  //       products.forEach((product) => {
  //         let productToAdd = cartDetails.products.find(
  //           (cartProduct) => product.id == cartProduct.id
  //         );
  //         if (productToAdd) {
  //           cartProducts.push({
  //             productData: product,
  //             productQty: productToAdd.qty,
  //             productTotalPrice: product.price * productToAdd.qty,
  //           });
  //         }
  //       });
  //     }

  //     console.log(cartProducts);
  //   });
  // });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

exports.postCartDeleteItem = (req, res, next) => {
  const productId = req.params.productId;
  let productPrice = 0;
  Product.getProductById(productId, (product) => {
    productPrice = product.price;
    Cart.deleteProduct(productId, productPrice);
    res.redirect("/cart");
  });
};
