const express = require("express");

const adminController = require("../controllers/admin");
const guard = require("../middleware/guard");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", guard, adminController.getAddProduct);

// /admin/edit-product => GET
router.get("/edit-product/:id", guard, adminController.getEditProduct);

// /admin/products => GET
router.get("/products", guard, adminController.getProducts);

// /admin/edit-product/:id => POST
router.post("/edit-product/:id", guard, adminController.postEditProduct);

// /admin/add-product => POST
router.post("/add-product", guard, adminController.postAddProduct);

// /admin/delete-product/:id => DELETE
router.post("/delete-product/:id", guard, adminController.deleteProduct);

module.exports = router;
