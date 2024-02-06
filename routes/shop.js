const express = require("express");

const shopController = require("../controllers/shop");

const guard = require("../middleware/guard");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

router.get("/cart", guard, shopController.getCart);

router.post("/cart", guard, shopController.postCart);

router.post(
  "/cart-delete-item/:productId",
  guard,
  shopController.postCartDeleteItem
);

router.post("/create-order", guard, shopController.postOrder);

router.get("/orders", guard, shopController.getOrders);

module.exports = router;
