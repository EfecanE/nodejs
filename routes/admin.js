const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", adminController.getAddProduct);

// /admin/edit-product => GET
router.get("/edit-product/:id", adminController.getEditProduct);

// // /admin/products => GET
router.get("/products", adminController.getProducts);

// /admin/edit-product/:id => POST
router.post("/edit-product/:id", adminController.postEditProduct);

// // /admin/add-product => POST
router.post("/add-product", adminController.postAddProduct);

// // /admin/delete-product/:id => DELETE
router.post("/delete-product/:id", adminController.deleteProduct);

module.exports = router;
